"""
Serializers for Restoration Orders
"""

from rest_framework import serializers
from .models import RestorationOrder, RestorationImage, RestorationReview


class RestorationImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RestorationImage
        fields = '__all__'
        read_only_fields = ['id', 'created_at']


class RestorationReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    
    class Meta:
        model = RestorationReview
        fields = '__all__'
        read_only_fields = ['id', 'customer', 'created_at']


class RestorationOrderSerializer(serializers.ModelSerializer):
    images = RestorationImageSerializer(many=True, read_only=True)
    review = RestorationReviewSerializer(read_only=True)
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    studio_name = serializers.CharField(source='studio.studio_name', read_only=True)
    
    class Meta:
        model = RestorationOrder
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'completed_at']


class RestorationOrderListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listings"""
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    original_images_count = serializers.SerializerMethodField()
    
    class Meta:
        model = RestorationOrder
        fields = ['id', 'title', 'service_type', 'priority', 'status', 
                  'estimated_price', 'is_paid', 'customer_name', 'original_images_count', 'created_at']
    
    def get_original_images_count(self, obj):
        return obj.images.filter(image_type='original').count()
