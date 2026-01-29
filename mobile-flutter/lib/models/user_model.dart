/// User Model
class User {
  final String id;
  final String email;
  final String username;
  final String firstName;
  final String lastName;
  final String phone;
  final String userType;
  final String? profilePicture;
  final bool isVerified;
  final DateTime createdAt;
  
  User({
    required this.id,
    required this.email,
    required this.username,
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.userType,
    this.profilePicture,
    required this.isVerified,
    required this.createdAt,
  });
  
  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'].toString(),
      email: json['email'] ?? '',
      username: json['username'] ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      phone: json['phone'] ?? '',
      userType: json['user_type'] ?? 'customer',
      profilePicture: json['profile_picture'],
      isVerified: json['is_verified'] ?? false,
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }
  
  String get fullName => '$firstName $lastName';
  
  bool get isStudioOwner => userType == 'studio_owner';
  bool get isCustomer => userType == 'customer';
}
