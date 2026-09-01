"""
URL configuration for Studio Backend.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.utils import timezone
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

def health_check(request):
    """Lightweight health check endpoint for 24/7 uptime pings"""
    return JsonResponse({
        "status": "healthy",
        "service": "studio-django-api",
        "timestamp": timezone.now().isoformat()
    })

# API Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="Studio Management API",
        default_version='v1',
        description="API for Photo Studio Management - Albums, Bookings, Restoration & Payments",
        terms_of_service="https://www.studio.com/terms/",
        contact=openapi.Contact(email="support@studio.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Health Check (Keep-Alive)
    path('api/v1/health/', health_check, name='health-check'),

    # Admin
    path('admin/', admin.site.urls),
    
    # API Endpoints
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/albums/', include('albums.urls')),
    path('api/v1/bookings/', include('bookings.urls')),
    path('api/v1/restoration/', include('restoration.urls')),
    path('api/v1/payments/', include('payments.urls')),
    
    # API Documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
