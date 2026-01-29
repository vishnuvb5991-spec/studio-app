"""
URL patterns for Restoration app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RestorationOrderViewSet, RestorationImageViewSet

router = DefaultRouter()
router.register(r'images', RestorationImageViewSet, basename='restoration-image')
router.register(r'', RestorationOrderViewSet, basename='restoration')

urlpatterns = [
    path('', include(router.urls)),
]
