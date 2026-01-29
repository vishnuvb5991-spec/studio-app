"""
Serializers for Bookings
"""

from rest_framework import serializers
from .models import Booking, Service, BookingNote, TimeSlot
from accounts.serializers import UserSerializer, StudioProfileSerializer


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class BookingNoteSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    
    class Meta:
        model = BookingNote
        fields = '__all__'
        read_only_fields = ['id', 'author', 'created_at']


class BookingSerializer(serializers.ModelSerializer):
    services = ServiceSerializer(many=True, read_only=True)
    service_ids = serializers.ListField(
        child=serializers.UUIDField(),
        write_only=True,
        required=False
    )
    notes = BookingNoteSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    studio_name = serializers.CharField(source='studio.studio_name', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ['id', 'balance_amount', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        service_ids = validated_data.pop('service_ids', [])
        booking = Booking.objects.create(**validated_data)
        
        if service_ids:
            services = Service.objects.filter(id__in=service_ids)
            booking.services.set(services)
        
        return booking


class BookingListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for booking listings"""
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    studio_name = serializers.CharField(source='studio.studio_name', read_only=True)
    
    class Meta:
        model = Booking
        fields = ['id', 'event_name', 'event_type', 'event_date', 'status', 
                  'total_amount', 'advance_paid', 'customer_name', 'studio_name']


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = '__all__'
        read_only_fields = ['id']
