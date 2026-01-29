/// API Configuration
class ApiConfig {
  // Django Backend
  static const String djangoBaseUrl = 'http://10.0.2.2:8000/api/v1';  // Android emulator
  // static const String djangoBaseUrl = 'http://localhost:8000/api/v1';  // iOS/Web
  
  // Node.js Real-time Server
  static const String nodeBaseUrl = 'http://10.0.2.2:5000';  // Android emulator
  // static const String nodeBaseUrl = 'http://localhost:5000';  // iOS/Web
  
  // Razorpay
  static const String razorpayKeyId = 'rzp_test_xxxxxxxxxxxx';
  
  // API Endpoints
  static const String auth = '$djangoBaseUrl/auth';
  static const String albums = '$djangoBaseUrl/albums';
  static const String bookings = '$djangoBaseUrl/bookings';
  static const String restoration = '$djangoBaseUrl/restoration';
  static const String payments = '$djangoBaseUrl/payments';
  
  // Socket.io
  static const String socketUrl = nodeBaseUrl;
  
  // Headers
  static Map<String, String> headers(String? token) {
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }
}
