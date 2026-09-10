import 'dart:io';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/restoration_model.dart';

/// Restoration Provider
class RestorationProvider extends ChangeNotifier {
  List<RestorationOrder> _orders = [];
  List<dynamic> _studios = [];
  bool _isLoading = false;
  String? _error;
  
  final Dio _dio = Dio();
  
  List<RestorationOrder> get orders => _orders;
  List<dynamic> get studios => _studios;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  Future<void> fetchOrders(String token) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final response = await _dio.get(
        '${ApiConfig.restoration}/',
        options: Options(headers: ApiConfig.headers(token)),
      );
      
      // Handle potential pagination
      final dynamic data = response.data;
      final List results = data is List ? data : (data['results'] ?? []);
      
      _orders = results.map((json) => RestorationOrder.fromJson(json)).toList();
      _error = null;
    } on DioException catch (e) {
      _error = e.message;
    }
    
    _isLoading = false;
    notifyListeners();
  }
  
  Future<RestorationOrder?> createOrder({
    required String token,
    required String title,
    required String description,
    required String serviceType,
    required String priority,
    required String studioId,
  }) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final response = await _dio.post(
        '${ApiConfig.restoration}/',
        data: {
          'title': title,
          'description': description,
          'service_type': serviceType,
          'priority': priority,
          'studio': studioId,
        },
        options: Options(headers: ApiConfig.headers(token)),
      );
      
      final newOrder = RestorationOrder.fromJson(response.data);
      _orders.insert(0, newOrder);
      _error = null;
      _isLoading = false;
      notifyListeners();
      return newOrder;
    } on DioException catch (e) {
      _error = e.message;
      _isLoading = false;
      notifyListeners();
      return null;
    }
  }

  Future<bool> uploadOriginalImage(String orderId, File imageFile, String token) async {
    try {
      String fileName = imageFile.path.split('/').last;
      FormData formData = FormData.fromMap({
        "images": await MultipartFile.fromFile(imageFile.path, filename: fileName),
      });

      await _dio.post(
        '${ApiConfig.restoration}/$orderId/upload_original/',
        data: formData,
        options: Options(headers: ApiConfig.headers(token)),
      );
      
      return true;
    } on DioException catch (e) {
      _error = e.message;
      notifyListeners();
      return false;
    }
  }

  Future<void> fetchStudios(String token) async {
    try {
      final response = await _dio.get(
        '${ApiConfig.djangoBaseUrl}/auth/studios/',
        options: Options(headers: ApiConfig.headers(token)),
      );
      
      final dynamic data = response.data;
      _studios = data is List ? data : (data['results'] ?? []);
      notifyListeners();
    } catch (e) {
      print('Fetch studios error: $e');
    }
  }
}
