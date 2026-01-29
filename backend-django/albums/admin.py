"""
Admin configuration for Albums app
"""

from django.contrib import admin
from .models import Album, Photo, AlbumShare


class PhotoInline(admin.TabularInline):
    model = Photo
    extra = 0
    readonly_fields = ['download_count', 'created_at']


@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    list_display = ['title', 'studio', 'customer', 'album_type', 'status', 'photo_count', 'created_at']
    list_filter = ['album_type', 'status', 'is_public']
    search_fields = ['title', 'studio__studio_name', 'customer__email']
    inlines = [PhotoInline]


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['id', 'album', 'order', 'is_featured', 'download_count']
    list_filter = ['is_featured', 'is_downloadable']


@admin.register(AlbumShare)
class AlbumShareAdmin(admin.ModelAdmin):
    list_display = ['album', 'shared_with_email', 'shared_by', 'can_download', 'created_at']
