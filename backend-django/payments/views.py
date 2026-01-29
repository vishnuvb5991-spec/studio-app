"""
Views for Payment Processing with Razorpay
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
import json
import hmac
import hashlib
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from datetime import datetime
import uuid
import logging

from .models import Payment, Invoice, Refund
from .serializers import (
    PaymentSerializer, PaymentListSerializer, CreateOrderSerializer,
    VerifyPaymentSerializer, InvoiceSerializer, RefundSerializer,
    RefundRequestSerializer
)
from .utils import (
    validate_payment_amount, sanitize_payment_description,
    log_payment_attempt, detect_suspicious_activity, generate_secure_receipt
)
from .razorpay_client import razorpay_client
from bookings.models import Booking
from restoration.models import RestorationOrder


class PaymentViewSet(viewsets.ModelViewSet):
    """ViewSet for Payment history"""
    
    serializer_class = PaymentSerializer
    
    def get_queryset(self):
        return Payment.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PaymentListSerializer
        return PaymentSerializer


class CreatePaymentOrderView(APIView):
    """
    Create Razorpay order for payment
    Supports: Google Pay, PhonePe, UPI, Cards, Net Banking
    """
    
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        amount = data['amount']
        payment_type = data['payment_type']
        
        # Validate payment amount
        try:
            validated_amount = validate_payment_amount(amount)
        except ValidationError as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Detect suspicious activity
        if detect_suspicious_activity(request.user, validated_amount):
            logging.warning(f"Suspicious payment attempt detected: User={request.user.id}, Amount={validated_amount}")
        
        # Log payment attempt
        log_payment_attempt(request.user, validated_amount, payment_type)
        
        # Sanitize description
        description = sanitize_payment_description(data.get('description', ''))
        
        # Create Razorpay order
        try:
            razorpay_order = razorpay_client.create_order(
                amount=float(validated_amount),
                receipt=generate_secure_receipt(),
                notes={
                    'payment_type': payment_type,
                    'user_id': str(request.user.id),
                    'ip_address': request.META.get('REMOTE_ADDR', 'unknown')
                }
            )
        except Exception as e:
            logging.error(f"Razorpay order creation failed: {str(e)}")
            return Response(
                {'error': f'Failed to create order: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Create payment record
        payment = Payment.objects.create(
            user=request.user,
            amount=validated_amount,
            payment_type=payment_type,
            razorpay_order_id=razorpay_order['id'],
            receipt=razorpay_order['receipt'],
            description=description,
            status='pending'
        )
        
        # Link to booking or restoration order
        if data.get('booking_id'):
            payment.booking = Booking.objects.get(id=data['booking_id'])
        if data.get('restoration_order_id'):
            payment.restoration_order = RestorationOrder.objects.get(id=data['restoration_order_id'])
        payment.save()
        
        return Response({
            'payment_id': str(payment.id),
            'razorpay_order_id': razorpay_order['id'],
            'razorpay_key': settings.RAZORPAY_KEY_ID,
            'amount': int(float(validated_amount) * 100),  # Amount in paise
            'currency': 'INR',
            'name': 'Studio Management',
            'description': payment_type.replace('_', ' ').title(),
            'prefill': {
                'name': request.user.get_full_name(),
                'email': request.user.email,
                'contact': request.user.phone
            },
            'theme': {
                'color': '#6366f1'
            }
        })


class VerifyPaymentView(APIView):
    """
    Verify Razorpay payment signature after successful payment
    """
    
    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        # Verify signature
        is_valid = razorpay_client.verify_payment_signature(
            data['razorpay_order_id'],
            data['razorpay_payment_id'],
            data['razorpay_signature']
        )
        
        if not is_valid:
            return Response(
                {'error': 'Payment verification failed', 'success': False},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update payment record
        try:
            payment = Payment.objects.get(id=data['payment_id'])
            payment.razorpay_payment_id = data['razorpay_payment_id']
            payment.razorpay_signature = data['razorpay_signature']
            payment.status = 'completed'
            
            # Get payment method from Razorpay
            payment_details = razorpay_client.fetch_payment(data['razorpay_payment_id'])
            method = payment_details.get('method', 'razorpay')
            
            if method == 'upi':
                vpa = payment_details.get('vpa', '')
                if 'gpay' in vpa.lower() or '@ok' in vpa.lower():
                    payment.payment_method = 'google_pay'
                elif 'ybl' in vpa.lower() or 'ibl' in vpa.lower():
                    payment.payment_method = 'phone_pe'
                else:
                    payment.payment_method = 'upi'
                payment.upi_transaction_id = payment_details.get('acquirer_data', {}).get('upi_transaction_id', '')
            elif method == 'card':
                payment.payment_method = 'card'
            elif method == 'netbanking':
                payment.payment_method = 'netbanking'
            
            payment.save()
            
            # Update related booking/restoration if applicable
            if payment.booking:
                booking = payment.booking
                if payment.payment_type == 'booking_advance':
                    booking.advance_paid = True
                elif payment.payment_type in ['booking_full', 'booking_balance']:
                    booking.advance_paid = True
                booking.save()
            
            if payment.restoration_order:
                payment.restoration_order.is_paid = True
                payment.restoration_order.save()
            
            return Response({
                'success': True,
                'message': 'Payment verified successfully',
                'payment': PaymentSerializer(payment).data
            })
            
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment not found', 'success': False},
                status=status.HTTP_404_NOT_FOUND
            )


class RefundView(APIView):
    """Process refund for a payment"""
    
    def post(self, request):
        serializer = RefundRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        data = serializer.validated_data
        
        try:
            payment = Payment.objects.get(id=data['payment_id'])
            
            if payment.status != 'completed':
                return Response(
                    {'error': 'Can only refund completed payments'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Process refund via Razorpay
            razorpay_refund = razorpay_client.create_refund(
                payment.razorpay_payment_id,
                float(data['amount']),
                notes={'reason': data['reason']}
            )
            
            # Create refund record
            refund = Refund.objects.create(
                payment=payment,
                amount=data['amount'],
                reason=data['reason'],
                razorpay_refund_id=razorpay_refund['id'],
                status='processed',
                processed_at=datetime.now()
            )
            
            # Update payment status
            payment.status = 'refunded'
            payment.save()
            
            return Response({
                'success': True,
                'message': 'Refund processed successfully',
                'refund': RefundSerializer(refund).data
            })
            
        except Payment.DoesNotExist:
            return Response(
                {'error': 'Payment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Refund failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PaymentWebhookView(APIView):
    """
    Razorpay Webhook handler with signature verification
    Handles payment events from Razorpay securely
    """
    
    permission_classes = [permissions.AllowAny]
    
    def verify_webhook_signature(self, payload, signature):
        """
        Verify Razorpay webhook signature
        
        Args:
            payload: Raw request body as string
            signature: X-Razorpay-Signature header
            
        Returns:
            True if signature is valid, False otherwise
        """
        if not signature:
            return False
            
        # Compute expected signature
        expected_signature = hmac.new(
            key=settings.RAZORPAY_KEY_SECRET.encode('utf-8'),
            msg=payload.encode('utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()
        
        # Compare signatures
        return hmac.compare_digest(expected_signature, signature)
    
    @method_decorator(csrf_exempt)
    def post(self, request):
        # Get raw payload for signature verification
        payload_body = request.body
        signature = request.headers.get('X-Razorpay-Signature', '')
        
        # Verify webhook signature
        if not self.verify_webhook_signature(payload_body.decode('utf-8'), signature):
            logging.warning("Invalid webhook signature received")
            return Response(
                {'error': 'Invalid signature'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            payload = json.loads(payload_body)
            event = payload.get('event', '')
            logging.info(f"Processing webhook event: {event}")
            
        except json.JSONDecodeError:
            logging.error("Invalid JSON in webhook payload")
            return Response(
                {'error': 'Invalid JSON'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if event == 'payment.captured':
            payment_entity = payload['payload']['payment']['entity']
            order_id = payment_entity.get('order_id')
            payment_id = payment_entity.get('id')
            amount = payment_entity.get('amount') / 100  # Convert from paise
            method = payment_entity.get('method', 'razorpay')
            
            try:
                payment = Payment.objects.get(razorpay_order_id=order_id)
                
                # Update payment details
                payment.razorpay_payment_id = payment_id
                payment.amount = amount  # Update with actual amount
                payment.status = 'completed'
                
                # Detect payment method
                if method == 'upi':
                    vpa = payment_entity.get('vpa', '')
                    if 'gpay' in vpa.lower() or '@ok' in vpa.lower():
                        payment.payment_method = 'google_pay'
                    elif 'ybl' in vpa.lower() or 'ibl' in vpa.lower():
                        payment.payment_method = 'phone_pe'
                    else:
                        payment.payment_method = 'upi'
                    payment.upi_transaction_id = payment_entity.get('acquirer_data', {}).get('upi_transaction_id', '')
                elif method == 'card':
                    payment.payment_method = 'card'
                elif method == 'netbanking':
                    payment.payment_method = 'netbanking'
                
                payment.save()
                
                # Update related booking/restoration
                if payment.booking:
                    booking = payment.booking
                    if payment.payment_type == 'booking_advance':
                        booking.advance_paid = True
                    elif payment.payment_type in ['booking_full', 'booking_balance']:
                        booking.advance_paid = True
                    booking.save()
                
                if payment.restoration_order:
                    payment.restoration_order.is_paid = True
                    payment.restoration_order.save()
                
                logging.info(f"Payment captured: {payment_id} for order {order_id}")
                
            except Payment.DoesNotExist:
                logging.warning(f"Payment not found for order_id: {order_id}")
                pass
        
        elif event == 'order.paid':
            # Handle order.paid event (alternative to payment.captured)
            order_entity = payload['payload']['order']['entity']
            order_id = order_entity.get('id')
            payments = order_entity.get('payments', [])
            
            try:
                payment = Payment.objects.get(razorpay_order_id=order_id)
                
                if payments and payment.status != 'completed':
                    # Update with first successful payment
                    payment_entity = payments[0]
                    payment.razorpay_payment_id = payment_entity.get('id')
                    payment.status = 'completed'
                    payment.save()
                    
                    # Update related objects
                    if payment.booking:
                        booking = payment.booking
                        if payment.payment_type == 'booking_advance':
                            booking.advance_paid = True
                        elif payment.payment_type in ['booking_full', 'booking_balance']:
                            booking.advance_paid = True
                        booking.save()
                    
                    if payment.restoration_order:
                        payment.restoration_order.is_paid = True
                        payment.restoration_order.save()
                
                logging.info(f"Order paid: {order_id}")
                
            except Payment.DoesNotExist:
                logging.warning(f"Payment not found for order_id: {order_id}")
                pass
        
        elif event == 'payment.failed':
            payment_entity = payload['payload']['payment']['entity']
            order_id = payment_entity.get('order_id')
            error_code = payment_entity.get('error_code', '')
            error_description = payment_entity.get('error_description', '')
            
            try:
                payment = Payment.objects.get(razorpay_order_id=order_id)
                payment.status = 'failed'
                payment.notes = {
                    'error_code': error_code,
                    'error_description': error_description,
                    'failed_at': datetime.now().isoformat()
                }
                payment.save()
                
                logging.warning(f"Payment failed: {order_id} - {error_code}: {error_description}")
                
            except Payment.DoesNotExist:
                logging.warning(f"Payment not found for failed order_id: {order_id}")
                pass
        
        elif event == 'refund.processed':
            refund_entity = payload['payload']['refund']['entity']
            refund_id = refund_entity['id']
            payment_id = refund_entity.get('payment_id')
            amount = refund_entity.get('amount', 0) / 100  # Convert from paise
            
            try:
                refund = Refund.objects.get(razorpay_refund_id=refund_id)
                refund.status = 'processed'
                refund.amount = amount  # Update with actual amount
                refund.processed_at = datetime.now()
                refund.save()
                
                # Update payment status
                if refund.payment:
                    refund.payment.status = 'refunded'
                    refund.payment.save()
                
                logging.info(f"Refund processed: {refund_id} for payment {payment_id}")
                
            except Refund.DoesNotExist:
                logging.warning(f"Refund not found for refund_id: {refund_id}")
                pass
        
        # Log unknown events
        else:
            logging.info(f"Unhandled webhook event: {event}")
        
        return Response({'status': 'ok'})


class InvoiceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Invoice viewing"""
    
    serializer_class = InvoiceSerializer
    
    def get_queryset(self):
        return Invoice.objects.filter(payment__user=self.request.user)
