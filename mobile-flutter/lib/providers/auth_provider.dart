import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';
import '../models/user_model.dart';

/// Authentication Provider
class AuthProvider extends ChangeNotifier {
  User? _user;
  String? _token;
  bool _isLoading = false;
  String? _error;
  
  final Dio _dio = Dio();
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  
  User? get user => _user;
  String? get token => _token;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _token != null;
  String? get error => _error;
  
  AuthProvider() {
    _loadToken();
  }
  
  Future<void> _loadToken() async {
    _token = await _storage.read(key: 'access_token');
    if (_token != null) {
      await fetchProfile();
    }
    notifyListeners();
  }
  
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await _dio.post(
        '${ApiConfig.auth}/login/',
        data: {'email': email, 'password': password},
      );
      
      _token = response.data['tokens']['access'];
      _user = User.fromJson(response.data['user']);
      
      await _storage.write(key: 'access_token', value: _token);
      await _storage.write(key: 'refresh_token', value: response.data['tokens']['refresh']);
      
      _isLoading = false;
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _error = e.response?.data?['error'] ?? 'Login failed';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  Future<bool> register({
    required String email,
    required String username,
    required String firstName,
    required String lastName,
    required String phone,
    required String password,
    required String userType,
  }) async {
    _isLoading = true;
    _error = null;
    notifyListeners();
    
    try {
      final response = await _dio.post(
        '${ApiConfig.auth}/register/',
        data: {
          'email': email,
          'username': username,
          'first_name': firstName,
          'last_name': lastName,
          'phone': phone,
          'password': password,
          'password2': password,
          'user_type': userType,
        },
      );
      
      _token = response.data['tokens']['access'];
      _user = User.fromJson(response.data['user']);
      
      await _storage.write(key: 'access_token', value: _token);
      await _storage.write(key: 'refresh_token', value: response.data['tokens']['refresh']);
      
      _isLoading = false;
      notifyListeners();
      return true;
    } on DioException catch (e) {
      _error = e.response?.data?.toString() ?? 'Registration failed';
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
  
  Future<void> fetchProfile() async {
    try {
      final response = await _dio.get(
        '${ApiConfig.auth}/profile/',
        options: Options(headers: ApiConfig.headers(_token)),
      );
      _user = User.fromJson(response.data);
      notifyListeners();
    } catch (e) {
      // Token might be expired
      await logout();
    }
  }
  
  Future<void> logout() async {
    _token = null;
    _user = null;
    await _storage.deleteAll();
    notifyListeners();
  }
}
