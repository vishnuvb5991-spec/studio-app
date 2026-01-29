"""
Payment utility functions for security and validation
"""

import re
import time
import logging
import secrets
from decimal import Decimal, InvalidOperation
from django.core.exceptions import ValidationError


def validate_payment_amount(amount):
    """
    Validate payment amount for security
    
    Args:
        amount: Amount to validate
        
    Returns:
        Decimal: Validated amount
        
    Raises:
        ValidationError: If amount is invalid
    """
    try:
        # Convert to Decimal
        decimal_amount = Decimal(str(amount))
        
        # Check minimum amount (₹1)
        if decimal_amount < Decimal('1.00'):
            raise ValidationError("Minimum payment amount is ₹1.00")
        
        # Check maximum amount (₹10,00,000)
        if decimal_amount > Decimal('1000000.00'):
            raise ValidationError("Maximum payment amount is ₹10,00,000")
        
        # Check decimal places (max 2)
        if decimal_amount.as_tuple().exponent < -2:
            raise ValidationError("Amount can have maximum 2 decimal places")
        
        return decimal_amount
        
    except (InvalidOperation, ValueError):
        raise ValidationError("Invalid payment amount format")


def validate_upi_id(upi_id):
    """
    Validate UPI ID format
    
    Args:
        upi_id: UPI ID to validate
        
    Returns:
        bool: True if valid, False otherwise
    """
    if not upi_id:
        return False
    
    # Basic UPI ID validation (username@provider)
    pattern = r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$'
    return bool(re.match(pattern, upi_id))


def sanitize_payment_description(description):
    """
    Sanitize payment description to prevent XSS
    
    Args:
        description: Raw description
        
    Returns:
        str: Sanitized description
    """
    if not description:
        return ""
    
    # Remove HTML tags and special characters
    sanitized = re.sub(r'<[^>]+>', '', description)
    sanitized = re.sub(r'[<>"\']', '', sanitized)
    
    # Limit length
    return sanitized[:500]


def log_payment_attempt(user, amount, payment_type, status='attempt'):
    """
    Log payment attempts for security monitoring
    
    Args:
        user: User object
        amount: Payment amount
        payment_type: Type of payment
        status: Status of attempt
    """
    logging.info(
        f"Payment {status}: User={user.id}, "
        f"Amount={amount}, Type={payment_type}, "
        f"IP={getattr(user, 'last_login_ip', 'unknown')}"
    )


def detect_suspicious_activity(user, amount):
    """
    Detect potentially suspicious payment activity
    
    Args:
        user: User object
        amount: Payment amount
        
    Returns:
        bool: True if suspicious, False otherwise
    """
    # Check for unusually high amount
    if amount > Decimal('50000.00'):  # ₹50,000
        logging.warning(f"High value payment detected: User={user.id}, Amount={amount}")
        return True
    
    # Check for rapid successive payments (would need database query in real implementation)
    # This is a placeholder for more sophisticated logic
    
    return False


def generate_secure_receipt():
    """
    Generate a secure receipt ID
    
    Returns:
        str: Secure receipt ID
    """
    import uuid
    
    # Generate a secure random receipt ID
    random_part = secrets.token_hex(8)
    timestamp = str(int(time.time()))
    
    return f"rcpt_{timestamp}_{random_part}"
