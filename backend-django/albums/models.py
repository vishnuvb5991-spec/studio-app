"""
Models for Photo Albums Management
"""

from django.db import models
from accounts.models import User, StudioProfile
import uuid


class Album(models.Model):
    """Photo Album model"""
    
    ALBUM_TYPE_CHOICES = [
        ('wedding', 'Wedding'),
        ('pre_wedding', 'Pre-Wedding'),
        ('engagement', 'Engagement'),
        ('birthday', 'Birthday'),
        ('corporate', 'Corporate Event'),
        ('portrait', 'Portrait'),
        ('family', 'Family'),
        ('other', 'Other'),
    ]
    
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('processing', 'Processing'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    studio = models.ForeignKey(StudioProfile, on_delete=models.CASCADE, related_name='albums')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='customer_albums')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    album_type = models.CharField(max_length=20, choices=ALBUM_TYPE_CHOICES, default='wedding')
    event_date = models.DateField(blank=True, null=True)
    cover_image = models.ImageField(
        upload_to='album_covers/',
        blank=True, 
        null=True,
        max_length=500,
        help_text="Upload high-resolution cover image (Recommended: 1920x1080px, Max: 10MB)"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    is_public = models.BooleanField(default=False)
    password = models.CharField(max_length=50, blank=True)  # For private album access
    view_count = models.IntegerField(default=0)
    download_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'albums'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.studio.studio_name}"
    
    @property
    def photo_count(self):
        return self.photos.count()


class Photo(models.Model):
    """Individual Photo in an album"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='photos')
    image = models.ImageField(
        upload_to='album_photos/',
        max_length=500,
        help_text="Upload high-resolution photo (Recommended: 3000x2000px, Max: 20MB)"
    )
    thumbnail = models.ImageField(
        upload_to='album_thumbnails/', 
        blank=True, 
        null=True,
        max_length=500,
        help_text="Auto-generated thumbnail (300x300px)"
    )
    title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    is_featured = models.BooleanField(default=False)
    is_downloadable = models.BooleanField(default=True)
    download_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'photos'
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"Photo in {self.album.title}"


class AlbumShare(models.Model):
    """Share album with specific users"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    album = models.ForeignKey(Album, on_delete=models.CASCADE, related_name='shares')
    shared_with_email = models.EmailField()
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE)
    can_download = models.BooleanField(default=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'album_shares'
        unique_together = ['album', 'shared_with_email']
