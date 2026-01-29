import 'package:flutter/material.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../config/api_config.dart';
import '../models/notification_model.dart';

/// Notification Provider with Socket.io
class NotificationProvider extends ChangeNotifier {
  List<AppNotification> _notifications = [];
  int _unreadCount = 0;
  IO.Socket? _socket;
  bool _isConnected = false;
  
  List<AppNotification> get notifications => _notifications;
  int get unreadCount => _unreadCount;
  bool get isConnected => _isConnected;
  
  void connect(String userId, String userType, String userName) {
    _socket = IO.io(ApiConfig.socketUrl, <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });
    
    _socket!.connect();
    
    _socket!.onConnect((_) {
      _isConnected = true;
      
      // Join as user
      _socket!.emit('user:join', {
        'userId': userId,
        'userType': userType,
        'userName': userName,
      });
      
      notifyListeners();
    });
    
    _socket!.onDisconnect((_) {
      _isConnected = false;
      notifyListeners();
    });
    
    // Listen for new notifications
    _socket!.on('notification:new', (data) {
      final notification = AppNotification.fromJson(data);
      _notifications.insert(0, notification);
      _unreadCount++;
      notifyListeners();
    });
  }
  
  void disconnect() {
    _socket?.disconnect();
    _socket = null;
    _isConnected = false;
    notifyListeners();
  }
  
  void markAsRead(String notificationId) {
    final index = _notifications.indexWhere((n) => n.id == notificationId);
    if (index != -1 && !_notifications[index].isRead) {
      _notifications[index] = _notifications[index].copyWith(isRead: true);
      _unreadCount--;
      _socket?.emit('notification:read', {'notificationId': notificationId});
      notifyListeners();
    }
  }
  
  void markAllAsRead() {
    for (var i = 0; i < _notifications.length; i++) {
      _notifications[i] = _notifications[i].copyWith(isRead: true);
    }
    _unreadCount = 0;
    _socket?.emit('notification:readAll');
    notifyListeners();
  }
}
