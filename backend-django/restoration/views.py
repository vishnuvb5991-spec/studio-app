"""
Views for Restoration Orders
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from datetime import datetime
from .models import RestorationOrder, RestorationImage, RestorationReview
from .serializers import (
    RestorationOrderSerializer, RestorationOrderListSerializer,
    RestorationImageSerializer, RestorationReviewSerializer
)


class RestorationOrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Restoration Order CRUD"""
    
    serializer_class = RestorationOrderSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'studio_owner':
            return RestorationOrder.objects.filter(studio__user=user)
        return RestorationOrder.objects.filter(customer=user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return RestorationOrderListSerializer
        return RestorationOrderSerializer
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def upload_original(self, request, pk=None):
        """Upload original images for restoration"""
        order = self.get_object()
        images = request.FILES.getlist('images')
        
        uploaded = []
        for image in images:
            img = RestorationImage.objects.create(
                order=order,
                image=image,
                image_type='original'
            )
            uploaded.append(img)
        
        return Response({
            'message': f'{len(uploaded)} images uploaded',
            'images': RestorationImageSerializer(uploaded, many=True).data
        })
    
    @action(detail=True, methods=['post'])
    def upload_restored(self, request, pk=None):
        """Upload restored images (studio only)"""
        order = self.get_object()
        
        if request.user.user_type != 'studio_owner':
            return Response({'error': 'Only studio can upload restored images'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        images = request.FILES.getlist('images')
        
        uploaded = []
        for image in images:
            img = RestorationImage.objects.create(
                order=order,
                image=image,
                image_type='restored'
            )
            uploaded.append(img)
        
        return Response({
            'message': f'{len(uploaded)} restored images uploaded',
            'images': RestorationImageSerializer(uploaded, many=True).data
        })
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update order status"""
        order = self.get_object()
        new_status = request.data.get('status')
        
        if new_status in dict(RestorationOrder.STATUS_CHOICES):
            order.status = new_status
            if new_status == 'completed':
                order.completed_at = datetime.now()
            order.save()
            return Response({'message': f'Status updated to {new_status}'})
        
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def add_review(self, request, pk=None):
        """Add customer review"""
        order = self.get_object()
        
        if order.customer != request.user:
            return Response({'error': 'Only customer can review'}, 
                          status=status.HTTP_403_FORBIDDEN)
        
        if hasattr(order, 'review'):
            return Response({'error': 'Review already exists'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        review = RestorationReview.objects.create(
            order=order,
            customer=request.user,
            rating=request.data.get('rating'),
            comment=request.data.get('comment', '')
        )
        
        return Response(RestorationReviewSerializer(review).data)


class RestorationImageViewSet(viewsets.ModelViewSet):
    """ViewSet for Restoration Images"""
    
    serializer_class = RestorationImageSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_queryset(self):
        order_id = self.request.query_params.get('order_id')
        if order_id:
            return RestorationImage.objects.filter(order_id=order_id)
        return RestorationImage.objects.none()
