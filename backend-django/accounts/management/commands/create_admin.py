"""
Django management command to create initial admin user
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Create initial admin user if none exists'

    def handle(self, *args, **options):
        # Get credentials from environment variables (required — no hardcoded defaults)
        email = os.environ.get('ADMIN_EMAIL', 'admin@studio.com')
        password = os.environ.get('ADMIN_PASSWORD')
        username = os.environ.get('ADMIN_USERNAME', 'admin')

        if not password:
            self.stdout.write(
                self.style.ERROR('ADMIN_PASSWORD environment variable is required. Set it before running this command.')
            )
            return
        
        # Check if any superuser exists
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(
                self.style.WARNING('Superuser already exists. Skipping creation.')
            )
            return
        
        # Check if user with this email exists
        if User.objects.filter(email=email).exists():
            self.stdout.write(
                self.style.WARNING(f'User with email {email} already exists but is not a superuser.')
            )
            return
        
        # Create the admin user
        try:
            user = User.objects.create_superuser(
                username=username,
                email=email,
                password=password,
                first_name='Studio',
                last_name='Admin',
                user_type='studio_owner',
                is_verified=True
            )
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully created admin user: {email}')
            )
            self.stdout.write(
                self.style.WARNING(f'Default password: {password}')
            )
            
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to create admin user: {str(e)}')
            )
