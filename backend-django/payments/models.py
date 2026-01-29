"""
Models for Payment Processing
"""

from django.db import models
from accounts.models import User
from bookings.models import Booking
from restoration.models import RestorationOrder
import uuid


class Payment(models.Model):
    """Payment transaction model"""
    
    PAYMENT_TYPE_CHOICES = [
        ('booking_advance', 'Booking Advance'),
        ('booking_full', 'Booking Full Payment'),
        ('booking_balance', 'Booking Balance'),
        ('restoration', 'Restoration Payment'),
        ('album', 'Album Payment'),
        ('other', 'Other'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('razorpay', 'Razorpay'),
        ('upi', 'UPI'),
        ('google_pay', 'Google Pay'),
        ('phone_pe', 'PhonePe'),
        ('card', 'Credit/Debit Card'),
        ('netbanking', 'Net Banking'),
        ('cash', 'Cash'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    
    # Payment Details
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default='INR')
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPE_CHOICES)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='razorpay')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Razorpay Details
    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)
    razorpay_signature = models.CharField(max_length=255, blank=True)
    
    # Related Objects (Generic)
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    restoration_order = models.ForeignKey(RestorationOrder, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    
    # Additional Info
    description = models.TextField(blank=True)
    receipt = models.CharField(max_length=100, blank=True)
    notes = models.JSONField(default=dict)
    
    # UPI Details (for Google Pay / PhonePe)
    upi_transaction_id = models.CharField(max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Payment {self.id} - ₹{self.amount} ({self.status})"


class Invoice(models.Model):
    """Invoice for payments"""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='invoice')
    invoice_number = models.CharField(max_length=50, unique=True)
    
    # Customer Details
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=15, blank=True)
    customer_address = models.TextField(blank=True)
    
    # Items
    items = models.JSONField(default=list)  # List of items with description and amount
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    
    # PDF
    pdf_url = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'invoices'
    
    def __str__(self):
        return f"Invoice {self.invoice_number}"
    
    def save(self, *args, **kwargs):
        if not self.invoice_number:
            # Generate invoice number
            from datetime import datetime
            prefix = datetime.now().strftime('INV%Y%m')
            last_invoice = Invoice.objects.filter(invoice_number__startswith=prefix).order_by('-invoice_number').first()
            if last_invoice:
                last_num = int(last_invoice.invoice_number[-4:])
                self.invoice_number = f"{prefix}{str(last_num + 1).zfill(4)}"
            else:
                self.invoice_number = f"{prefix}0001"
        super().save(*args, **kwargs)


class Refund(models.Model):
    """Refund for payments"""
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('failed', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refunds')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    reason = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    razorpay_refund_id = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(blank=True, null=True)
    
    class Meta:
        db_table = 'refunds'
