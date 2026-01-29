"""
URL patterns for Payments app
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentViewSet, CreatePaymentOrderView, VerifyPaymentView,
    RefundView, PaymentWebhookView, InvoiceViewSet
)

router = DefaultRouter()
router.register(r'history', PaymentViewSet, basename='payment')
router.register(r'invoices', InvoiceViewSet, basename='invoice')

urlpatterns = [
    path('', include(router.urls)),
    path('create-order/', CreatePaymentOrderView.as_view(), name='create_order'),
    path('verify/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('refund/', RefundView.as_view(), name='refund'),
    path('webhook/', PaymentWebhookView.as_view(), name='webhook'),
]
