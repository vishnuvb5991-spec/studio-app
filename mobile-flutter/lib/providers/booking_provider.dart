import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/booking_model.dart';

/// Booking Provider
class BookingProvider extends ChangeNotifier {
  List<Booking> _bookings = [];
  Booking? _selectedBooking;
  Map<String, dynamic>? _dashboardStats;
  bool _isLoading = false;
  String? _error;
  
  final Dio _dio = Dio();
  
  List<Booking> get bookings => _bookings;
  Booking? get selectedBooking => _selectedBooking;
  Map<String, dynamic>? get dashboardStats => _dashboardStats;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  Future<void> fetchBookings(String token) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final response = await _dio.get(
        '${ApiConfig.bookings}/',
        options: Options(headers: ApiConfig.headers(token)),
      );
      
      _bookings = (response.data as List)
          .map((json) => Booking.fromJson(json))
          .toList();
      _error = null;
    } on DioException catch (e) {
      _error = e.message;
    }
    
    _isLoading = false;
    notifyListeners();
  }
  
  Future<void> fetchDashboardStats(String token) async {
    try {
      final response = await _dio.get(
        '${ApiConfig.bookings}/dashboard_stats/',
        options: Options(headers: ApiConfig.headers(token)),
      );
      
      _dashboardStats = response.data;
      notifyListeners();
    } catch (e) {
      // Ignore errors for dashboard stats
    }
  }
  
  Future<bool> createBooking(Map<String, dynamic> data, String token) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      await _dio.post(
        '${ApiConfig.bookings}/',
        data: data,
        options: Options(headers: ApiConfig.headers(token)),
      );
      
      await fetchBookings(token);
      return true;
    } on DioException catch (e) {
      _error = e.message;
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
