"""
Serializers for Albums
"""

from rest_framework import serializers
from .models import Album, Photo, AlbumShare
from accounts.serializers import UserSerializer


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = '__all__'
        read_only_fields = ['id', 'download_count', 'created_at']


class AlbumSerializer(serializers.ModelSerializer):
    photos = PhotoSerializer(many=True, read_only=True)
    photo_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Album
        fields = '__all__'
        read_only_fields = ['id', 'view_count', 'download_count', 'created_at']


class AlbumListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for album listings"""
    photo_count = serializers.ReadOnlyField()
    studio_name = serializers.CharField(source='studio.studio_name', read_only=True)
    
    class Meta:
        model = Album
        fields = ['id', 'title', 'album_type', 'cover_image', 'event_date', 
                  'status', 'photo_count', 'studio_name', 'created_at']


class AlbumShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlbumShare
        fields = '__all__'
        read_only_fields = ['id', 'shared_by', 'created_at']


class PhotoUploadSerializer(serializers.Serializer):
    """Serializer for bulk photo upload"""
    album_id = serializers.UUIDField()
    images = serializers.ListField(
        child=serializers.ImageField(),
        max_length=50  # Max 50 photos at once
    )
