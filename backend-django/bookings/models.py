"""
Models for Event Bookings (Marriages, Events)
"""

from django.db import models
from accounts.models import User, StudioProfile
import uuid


class Service(models.Model):
    """Services offered by studio"""
    
    SERVICE_TYPE_CHOICES = [
        ('photography', 'Photography'),
        ('videography', 'Videography'),
        ('album', 'Photo Album'),
        ('editing', 'Photo Editing'),
        ('drone', 'Drone Shots'),
        ('package', 'Complete Package'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    studio = models.ForeignKey(StudioProfile, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=255)
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration_hours = models.IntegerField(default=1)
    includes = models.JSONField(default=list)  # List of what's included
    is_active = models.BooleanField(default=True)
    image = models.ImageField(
        upload_to='services/',
        blank=True, 
        null=True,
        max_length=500,
        help_text="Upload high-resolution service image (Recommended: 800x600px, Max: 5MB)"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'services'
    
    def __str__(self):
        return f"{self.name} - ₹{self.price}"


class Booking(models.Model):
    """Event Booking model"""
    
    EVENT_TYPE_CHOICES = [
        ('wedding', 'Wedding'),
        ('pre_wedding', 'Pre-Wedding Shoot'),
        ('engagement', 'Engagement'),
        ('birthday', 'Birthday Party'),
        ('corporate', 'Corporate Event'),
        ('reception', 'Reception'),
        ('haldi', 'Haldi Ceremony'),
        ('mehendi', 'Mehendi Ceremony'),
        ('sangeet', 'Sangeet'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    studio = models.ForeignKey(StudioProfile, on_delete=models.CASCADE, related_name='bookings')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customer_bookings')
    services = models.ManyToManyField(Service, related_name='bookings')
    
    # Event Details
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE_CHOICES)
    event_name = models.CharField(max_length=255)
    event_date = models.DateField()
    event_time = models.TimeField()
    event_end_date = models.DateField(blank=True, null=True)
    venue_name = models.CharField(max_length=255)
    venue_address = models.TextField()
    
    # Booking Details
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    advance_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    advance_paid = models.BooleanField(default=False)
    balance_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    # Additional Info
    special_requests = models.TextField(blank=True)
    guests_count = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-event_date']
    
    def __str__(self):
        return f"{self.event_name} - {self.event_date}"
    
    def save(self, *args, **kwargs):
        self.balance_amount = self.total_amount - self.advance_amount
        super().save(*args, **kwargs)


class BookingNote(models.Model):
    """Notes for a booking"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='notes')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'booking_notes'
        ordering = ['-created_at']


class TimeSlot(models.Model):
    """Available time slots for studio"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    studio = models.ForeignKey(StudioProfile, on_delete=models.CASCADE, related_name='time_slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_available = models.BooleanField(default=True)
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True)
    
    class Meta:
        db_table = 'time_slots'
        unique_together = ['studio', 'date', 'start_time']
