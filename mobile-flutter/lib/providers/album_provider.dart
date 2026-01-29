import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import '../config/api_config.dart';
import '../models/album_model.dart';

/// Album Provider
class AlbumProvider extends ChangeNotifier {
  List<Album> _albums = [];
  Album? _selectedAlbum;
  bool _isLoading = false;
  String? _error;
  
  final Dio _dio = Dio();
  
  List<Album> get albums => _albums;
  Album? get selectedAlbum => _selectedAlbum;
  bool get isLoading => _isLoading;
  String? get error => _error;
  
  Future<void> fetchAlbums(String token) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final response = await _dio.get(
        '${ApiConfig.albums}/',
        options: Options(headers: ApiConfig.headers(token)),
      );
      
      _albums = (response.data as List)
          .map((json) => Album.fromJson(json))
          .toList();
      _error = null;
    } on DioException catch (e) {
      _error = e.message;
    }
    
    _isLoading = false;
    notifyListeners();
  }
  
  Future<void> fetchAlbumDetail(String albumId, String token) async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final response = await _dio.get(
        '${ApiConfig.albums}/$albumId/',
        options: Options(headers: ApiConfig.headers(token)),
      );
      
      _selectedAlbum = Album.fromJson(response.data);
      _error = null;
    } on DioException catch (e) {
      _error = e.message;
    }
    
    _isLoading = false;
    notifyListeners();
  }
  
  void clearSelectedAlbum() {
    _selectedAlbum = null;
    notifyListeners();
  }
}
