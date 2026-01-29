"""
Serializers for Payments
"""

from rest_framework import serializers
from .models import Payment, Invoice, Refund


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['id', 'razorpay_order_id', 'razorpay_payment_id', 
                          'razorpay_signature', 'created_at', 'updated_at']


class PaymentListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for payment listings"""
    
    class Meta:
        model = Payment
        fields = ['id', 'amount', 'currency', 'payment_type', 'payment_method', 
                  'status', 'created_at']


class CreateOrderSerializer(serializers.Serializer):
    """Serializer for creating Razorpay order"""
    
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    payment_type = serializers.ChoiceField(choices=Payment.PAYMENT_TYPE_CHOICES)
    booking_id = serializers.UUIDField(required=False)
    restoration_order_id = serializers.UUIDField(required=False)
    description = serializers.CharField(required=False, allow_blank=True)


class VerifyPaymentSerializer(serializers.Serializer):
    """Serializer for verifying Razorpay payment"""
    
    razorpay_order_id = serializers.CharField()
    razorpay_payment_id = serializers.CharField()
    razorpay_signature = serializers.CharField()
    payment_id = serializers.UUIDField()  # Our payment ID


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['id', 'invoice_number', 'created_at']


class RefundSerializer(serializers.ModelSerializer):
    class Meta:
        model = Refund
        fields = '__all__'
        read_only_fields = ['id', 'razorpay_refund_id', 'created_at', 'processed_at']


class RefundRequestSerializer(serializers.Serializer):
    """Serializer for refund request"""
    
    payment_id = serializers.UUIDField()
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    reason = serializers.CharField()
