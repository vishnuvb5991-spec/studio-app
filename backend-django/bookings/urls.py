"""
URL patterns for Bookings app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, ServiceViewSet, TimeSlotViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'timeslots', TimeSlotViewSet, basename='timeslot')
router.register(r'', BookingViewSet, basename='booking')

urlpatterns = [
    path('', include(router.urls)),
]
