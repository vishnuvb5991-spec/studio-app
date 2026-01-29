"""
Views for Bookings Management
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from datetime import datetime, timedelta
from .models import Booking, Service, BookingNote, TimeSlot
from .serializers import (
    BookingSerializer, BookingListSerializer, ServiceSerializer,
    BookingNoteSerializer, TimeSlotSerializer
)


class ServiceViewSet(viewsets.ModelViewSet):
    """ViewSet for Service CRUD"""
    
    serializer_class = ServiceSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'studio_owner':
            return Service.objects.filter(studio__user=user)
        # Customers see all active services
        return Service.objects.filter(is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(studio=self.request.user.studio_profile)


class BookingViewSet(viewsets.ModelViewSet):
    """ViewSet for Booking CRUD"""
    
    serializer_class = BookingSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'studio_owner':
            return Booking.objects.filter(studio__user=user)
        return Booking.objects.filter(customer=user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return BookingListSerializer
        return BookingSerializer
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_note(self, request, pk=None):
        """Add note to booking"""
        booking = self.get_object()
        content = request.data.get('content')
        
        note = BookingNote.objects.create(
            booking=booking,
            author=request.user,
            content=content
        )
        
        return Response(BookingNoteSerializer(note).data)
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update booking status"""
        booking = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(Booking.STATUS_CHOICES):
            booking.status = new_status
            booking.save()
            return Response({'message': f'Status updated to {new_status}'})
        
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def dashboard_stats(self, request):
        """Get booking statistics for dashboard"""
        user = request.user
        if user.user_type == 'studio_owner':
            bookings = Booking.objects.filter(studio__user=user)
        else:
            bookings = Booking.objects.filter(customer=user)
        
        today = datetime.now().date()
        
        stats = {
            'total_bookings': bookings.count(),
            'pending_bookings': bookings.filter(status='pending').count(),
            'confirmed_bookings': bookings.filter(status='confirmed').count(),
            'completed_bookings': bookings.filter(status='completed').count(),
            'upcoming_bookings': bookings.filter(event_date__gte=today).count(),
            'total_revenue': bookings.filter(status='completed').aggregate(
                total=Sum('total_amount'))['total'] or 0,
            'pending_payments': bookings.filter(advance_paid=False).aggregate(
                total=Sum('advance_amount'))['total'] or 0,
        }
        
        return Response(stats)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming bookings"""
        today = datetime.now().date()
        next_week = today + timedelta(days=7)
        
        queryset = self.get_queryset().filter(
            event_date__gte=today,
            event_date__lte=next_week
        ).order_by('event_date')
        
        serializer = BookingListSerializer(queryset, many=True)
        return Response(serializer.data)


class TimeSlotViewSet(viewsets.ModelViewSet):
    """ViewSet for TimeSlot management"""
    
    serializer_class = TimeSlotSerializer
    
    def get_queryset(self):
        user = self.request.user
        studio_id = self.request.query_params.get('studio_id')
        date = self.request.query_params.get('date')
        
        queryset = TimeSlot.objects.all()
        
        if user.user_type == 'studio_owner':
            queryset = queryset.filter(studio__user=user)
        elif studio_id:
            queryset = queryset.filter(studio_id=studio_id)
        
        if date:
            queryset = queryset.filter(date=date)
        
        return queryset.filter(is_available=True)
