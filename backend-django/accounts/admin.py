"""
Admin configuration for Accounts app
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, StudioProfile, CustomerProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'user_type', 'is_verified', 'is_active', 'created_at']
    list_filter = ['user_type', 'is_verified', 'is_active']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('phone', 'user_type', 'profile_picture', 'is_verified')}),
    )


@admin.register(StudioProfile)
class StudioProfileAdmin(admin.ModelAdmin):
    list_display = ['studio_name', 'user', 'city', 'rating', 'is_verified']
    list_filter = ['is_verified', 'city', 'state']
    search_fields = ['studio_name', 'user__email']


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'city', 'created_at']
    search_fields = ['user__email', 'city']
