"""DRF authentication for Supabase Auth access tokens.

Supabase validates the bearer token at its Auth endpoint.  Django then links
the verified Supabase identity to a local user for the existing booking and
payment models.  This keeps all Razorpay operations on the Django server.
"""

from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from rest_framework.exceptions import AuthenticationFailed
from rest_framework import authentication

from .models import User


class SupabaseAuthentication(authentication.BaseAuthentication):
    """Authenticate a request carrying a valid Supabase access token."""

    def authenticate(self, request):
        authorization = authentication.get_authorization_header(request).decode('utf-8')
        if not authorization.startswith('Bearer '):
            return None

        token = authorization.removeprefix('Bearer ').strip()
        if not token or not settings.SUPABASE_URL or not settings.SUPABASE_PUBLISHABLE_KEY:
            return None

        user_data = self._get_verified_user(token)
        if not user_data:
            # Let Django's JWT authenticator handle a Django-issued bearer token.
            return None

        user = self._get_or_create_user(user_data)
        if user is None:
            raise AuthenticationFailed('Supabase session does not contain a usable user identity.')
        return (user, token)

    def _get_verified_user(self, token):
        request = Request(
            f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/user",
            headers={
                'apikey': settings.SUPABASE_PUBLISHABLE_KEY,
                'Authorization': f'Bearer {token}',
            },
        )
        try:
            with urlopen(request, timeout=settings.SUPABASE_AUTH_TIMEOUT_SECONDS) as response:
                import json
                return json.loads(response.read().decode('utf-8'))
        except (HTTPError, URLError, TimeoutError, ValueError):
            return None

    @staticmethod
    def _get_or_create_user(user_data):
        supabase_user_id = user_data.get('id')
        email = user_data.get('email')
        if not supabase_user_id or not email:
            return None

        user = User.objects.filter(supabase_user_id=supabase_user_id).first()
        if user:
            return user

        # A verified Supabase email may safely link an existing Django account.
        user = User.objects.filter(email__iexact=email).first()
        if user:
            user.supabase_user_id = supabase_user_id
            user.save(update_fields=['supabase_user_id'])
            return user

        # Metadata is user-editable, so it is intentionally not used for roles.
        username = f"supabase_{supabase_user_id.replace('-', '')[:20]}"
        user = User(
            username=username,
            email=email,
            phone=user_data.get('phone') or '',
            supabase_user_id=supabase_user_id,
        )
        user.set_unusable_password()
        user.save()
        return user
