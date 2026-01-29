"""
Razorpay Payment Gateway Client
"""

import razorpay
from django.conf import settings


class RazorpayClient:
    """Razorpay API Client Wrapper"""
    
    def __init__(self):
        self.client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )
    
    def create_order(self, amount, currency='INR', receipt=None, notes=None):
        """
        Create a Razorpay order
        
        Args:
            amount: Amount in paise (₹100 = 10000 paise)
            currency: Currency code (default: INR)
            receipt: Receipt ID for your reference
            notes: Additional notes (dict)
        
        Returns:
            Order details dict with 'id', 'amount', 'currency', etc.
        """
        order_data = {
            'amount': int(amount * 100),  # Convert to paise
            'currency': currency,
            'payment_capture': 1,  # Auto capture
        }
        
        if receipt:
            order_data['receipt'] = receipt
        
        if notes:
            order_data['notes'] = notes
        
        return self.client.order.create(order_data)
    
    def verify_payment_signature(self, razorpay_order_id, razorpay_payment_id, razorpay_signature):
        """
        Verify payment signature to confirm payment is genuine
        
        Returns:
            True if signature is valid, False otherwise
        """
        try:
            self.client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })
            return True
        except razorpay.errors.SignatureVerificationError:
            return False
    
    def fetch_payment(self, payment_id):
        """Fetch payment details"""
        return self.client.payment.fetch(payment_id)
    
    def capture_payment(self, payment_id, amount):
        """Capture an authorized payment"""
        return self.client.payment.capture(payment_id, int(amount * 100))
    
    def create_refund(self, payment_id, amount, notes=None):
        """
        Create a refund for a payment
        
        Args:
            payment_id: Razorpay payment ID
            amount: Refund amount in rupees
            notes: Additional notes
        """
        refund_data = {
            'amount': int(amount * 100)
        }
        
        if notes:
            refund_data['notes'] = notes
        
        return self.client.payment.refund(payment_id, refund_data)
    
    def fetch_order(self, order_id):
        """Fetch order details"""
        return self.client.order.fetch(order_id)
    
    def fetch_order_payments(self, order_id):
        """Fetch all payments for an order"""
        return self.client.order.payments(order_id)


# Singleton instance
razorpay_client = RazorpayClient()
