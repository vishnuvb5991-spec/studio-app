"""
Models for Photo Restoration Orders
"""

from django.db import models
from accounts.models import User, StudioProfile
import uuid


class RestorationOrder(models.Model):
    """Photo Restoration Order model"""
    
    SERVICE_TYPE_CHOICES = [
        ('basic', 'Basic Restoration'),
        ('advanced', 'Advanced Restoration'),
        ('colorization', 'Colorization'),
        ('enhancement', 'Enhancement'),
        ('reconstruction', 'Reconstruction'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Under Review'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('normal', 'Normal (5-7 days)'),
        ('express', 'Express (2-3 days)'),
        ('urgent', 'Urgent (24 hours)'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    studio = models.ForeignKey(StudioProfile, on_delete=models.CASCADE, related_name='restoration_orders')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restoration_orders')
    
    # Order Details
    title = models.CharField(max_length=255)
    description = models.TextField()
    service_type = models.CharField(max_length=20, choices=SERVICE_TYPE_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='normal')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Pricing
    estimated_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    is_paid = models.BooleanField(default=False)
    
    # Dates
    due_date = models.DateField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'restoration_orders'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Restoration: {self.title}"


class RestorationImage(models.Model):
    """Images for restoration order (before/after)"""
    
    IMAGE_TYPE_CHOICES = [
        ('original', 'Original Image'),
        ('restored', 'Restored Image'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(RestorationOrder, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='restoration/')
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPE_CHOICES)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'restoration_images'
    
    def __str__(self):
        return f"{self.image_type} - {self.order.title}"


class RestorationReview(models.Model):
    """Customer review for restoration work"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.OneToOneField(RestorationOrder, on_delete=models.CASCADE, related_name='review')
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1-5 stars
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'restoration_reviews'
