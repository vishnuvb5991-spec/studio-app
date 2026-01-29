"""
URL patterns for Albums app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlbumViewSet, PhotoViewSet, PublicAlbumView

router = DefaultRouter()
router.register(r'', AlbumViewSet, basename='album')
router.register(r'photos', PhotoViewSet, basename='photo')
router.register(r'public', PublicAlbumView, basename='public-album')

urlpatterns = [
    path('', include(router.urls)),
]
