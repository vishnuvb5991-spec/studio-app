"""
Admin configuration for Restoration app
"""

from django.contrib import admin
from .models import RestorationOrder, RestorationImage, RestorationReview


class RestorationImageInline(admin.TabularInline):
    model = RestorationImage
    extra = 0


@admin.register(RestorationOrder)
class RestorationOrderAdmin(admin.ModelAdmin):
    list_display = ['title', 'customer', 'studio', 'service_type', 'priority', 'status', 'is_paid']
    list_filter = ['status', 'service_type', 'priority', 'is_paid']
    search_fields = ['title', 'customer__email', 'studio__studio_name']
    inlines = [RestorationImageInline]


@admin.register(RestorationReview)
class RestorationReviewAdmin(admin.ModelAdmin):
    list_display = ['order', 'customer', 'rating', 'created_at']
    list_filter = ['rating']
