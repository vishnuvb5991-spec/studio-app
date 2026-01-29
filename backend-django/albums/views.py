"""
Views for Albums Management
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from .models import Album, Photo, AlbumShare
from .serializers import (
    AlbumSerializer, AlbumListSerializer, PhotoSerializer, 
    AlbumShareSerializer, PhotoUploadSerializer
)


class AlbumViewSet(viewsets.ModelViewSet):
    """ViewSet for Album CRUD operations"""
    
    serializer_class = AlbumSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'studio_owner':
            return Album.objects.filter(studio__user=user)
        return Album.objects.filter(customer=user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AlbumListSerializer
        return AlbumSerializer
    
    def perform_create(self, serializer):
        if self.request.user.user_type == 'studio_owner':
            serializer.save(studio=self.request.user.studio_profile)
    
    @action(detail=True, methods=['post'])
    def upload_photos(self, request, pk=None):
        """Bulk upload photos to album"""
        album = self.get_object()
        images = request.FILES.getlist('images')
        
        photos = []
        for idx, image in enumerate(images):
            photo = Photo.objects.create(
                album=album,
                image=image,
                order=album.photo_count + idx
            )
            photos.append(photo)
        
        return Response({
            'message': f'{len(photos)} photos uploaded successfully',
            'photos': PhotoSerializer(photos, many=True).data
        })
    
    @action(detail=True, methods=['post'])
    def share(self, request, pk=None):
        """Share album with email"""
        album = self.get_object()
        email = request.data.get('email')
        can_download = request.data.get('can_download', True)
        
        share, created = AlbumShare.objects.get_or_create(
            album=album,
            shared_with_email=email,
            defaults={'shared_by': request.user, 'can_download': can_download}
        )
        
        # TODO: Send email notification
        
        return Response({
            'message': f'Album shared with {email}',
            'share': AlbumShareSerializer(share).data
        })
    
    @action(detail=True, methods=['get'])
    def increment_view(self, request, pk=None):
        """Increment view count"""
        album = self.get_object()
        album.view_count += 1
        album.save()
        return Response({'view_count': album.view_count})


class PhotoViewSet(viewsets.ModelViewSet):
    """ViewSet for Photo CRUD operations"""
    
    serializer_class = PhotoSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        album_id = self.request.query_params.get('album_id')
        if album_id:
            return Photo.objects.filter(album_id=album_id)
        return Photo.objects.none()
    
    @action(detail=True, methods=['post'])
    def download(self, request, pk=None):
        """Track photo download"""
        photo = self.get_object()
        photo.download_count += 1
        photo.save()
        return Response({'download_url': photo.image.url})


class PublicAlbumView(viewsets.ReadOnlyModelViewSet):
    """Public albums for portfolio showcase"""
    
    queryset = Album.objects.filter(is_public=True, status='ready')
    serializer_class = AlbumListSerializer
    permission_classes = [permissions.AllowAny]
