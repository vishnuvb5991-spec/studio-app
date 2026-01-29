"""
Middleware for Payment Security
"""

import logging
import time
from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from django.conf import settings


class PaymentSecurityMiddleware(MiddlewareMixin):
    """
    Security middleware for payment endpoints
    """
    
    def process_request(self, request):
        """Add security headers for payment endpoints"""
        
        if request.path.startswith('/api/payments/'):
            # Add security headers
            request.META['HTTP_X_CONTENT_TYPE_OPTIONS'] = 'nosniff'
            request.META['HTTP_X_FRAME_OPTIONS'] = 'DENY'
            request.META['HTTP_X_XSS_PROTECTION'] = '1; mode=block'
            
            # Log payment requests
            logging.info(f"Payment request: {request.method} {request.path}")
    
    def process_response(self, request, response):
        """Add security headers to response"""
        
        if request.path.startswith('/api/payments/'):
            response['X-Content-Type-Options'] = 'nosniff'
            response['X-Frame-Options'] = 'DENY'
            response['X-XSS-Protection'] = '1; mode=block'
            response['Referrer-Policy'] = 'strict-origin-when-cross-origin'
            
        return response


class RateLimitMiddleware(MiddlewareMixin):
    """
    Simple rate limiting for payment endpoints
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        self.rate_limits = {}
        super().__init__(get_response)
    
    def process_request(self, request):
        """Rate limit payment creation attempts"""
        
        if request.path == '/api/payments/create-order/' and request.method == 'POST':
            client_ip = self.get_client_ip(request)
            current_time = int(time.time())
            
            # Clean old entries (older than 1 minute)
            self.rate_limits = {
                ip: times for ip, times in self.rate_limits.items()
                if any(t > current_time - 60 for t in times)
            }
            
            # Check rate limit (max 5 orders per minute)
            if client_ip in self.rate_limits:
                recent_requests = [t for t in self.rate_limits[client_ip] if t > current_time - 60]
                if len(recent_requests) >= 5:
                    return JsonResponse({
                        'error': 'Too many payment attempts. Please try again later.'
                    }, status=429)
                
                self.rate_limits[client_ip].append(current_time)
            else:
                self.rate_limits[client_ip] = [current_time]
    
    def get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
