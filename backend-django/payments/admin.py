"""
Admin configuration for Payments app
"""

from django.contrib import admin
from .models import Payment, Invoice, Refund


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'amount', 'payment_type', 'payment_method', 'status', 'created_at']
    list_filter = ['status', 'payment_type', 'payment_method']
    search_fields = ['user__email', 'razorpay_order_id', 'razorpay_payment_id']
    readonly_fields = ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature']
    date_hierarchy = 'created_at'


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ['invoice_number', 'payment', 'customer_name', 'total', 'created_at']
    search_fields = ['invoice_number', 'customer_name', 'customer_email']


@admin.register(Refund)
class RefundAdmin(admin.ModelAdmin):
    list_display = ['id', 'payment', 'amount', 'status', 'created_at', 'processed_at']
    list_filter = ['status']
