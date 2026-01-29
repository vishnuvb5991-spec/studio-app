"""
Admin configuration for Bookings app
"""

from django.contrib import admin
from .models import Booking, Service, BookingNote, TimeSlot


class BookingNoteInline(admin.TabularInline):
    model = BookingNote
    extra = 0


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ['name', 'studio', 'service_type', 'price', 'is_active']
    list_filter = ['service_type', 'is_active']
    search_fields = ['name', 'studio__studio_name']


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['event_name', 'studio', 'customer', 'event_type', 'event_date', 'status', 'total_amount']
    list_filter = ['status', 'event_type', 'advance_paid']
    search_fields = ['event_name', 'studio__studio_name', 'customer__email']
    inlines = [BookingNoteInline]
    date_hierarchy = 'event_date'


@admin.register(TimeSlot)
class TimeSlotAdmin(admin.ModelAdmin):
    list_display = ['studio', 'date', 'start_time', 'end_time', 'is_available']
    list_filter = ['is_available', 'date']
