/// Restoration Order and Image Models
class RestorationOrder {
  final String id;
  final String title;
  final String description;
  final String serviceType;
  final String priority;
  final String status;
  final double estimatedPrice;
  final double? finalPrice;
  final bool isPaid;
  final DateTime? dueDate;
  final DateTime? completedAt;
  final List<RestorationImage> images;
  final DateTime createdAt;

  RestorationOrder({
    required this.id,
    required this.title,
    required this.description,
    required this.serviceType,
    required this.priority,
    required this.status,
    required this.estimatedPrice,
    this.finalPrice,
    required this.isPaid,
    this.dueDate,
    this.completedAt,
    this.images = const [],
    required this.createdAt,
  });

  factory RestorationOrder.fromJson(Map<String, dynamic> json) {
    return RestorationOrder(
      id: json['id'].toString(),
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      serviceType: json['service_type'] ?? 'basic',
      priority: json['priority'] ?? 'normal',
      status: json['status'] ?? 'pending',
      estimatedPrice: double.tryParse(json['estimated_price']?.toString() ?? '0') ?? 0,
      finalPrice: json['final_price'] != null ? double.tryParse(json['final_price'].toString()) : null,
      isPaid: json['is_paid'] ?? false,
      dueDate: json['due_date'] != null ? DateTime.parse(json['due_date']) : null,
      completedAt: json['completed_at'] != null ? DateTime.parse(json['completed_at']) : null,
      images: json['images'] != null
          ? (json['images'] as List).map((i) => RestorationImage.fromJson(i)).toList()
          : [],
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }
}

class RestorationImage {
  final String id;
  final String image;
  final String imageType;
  final String notes;
  final DateTime createdAt;

  RestorationImage({
    required this.id,
    required this.image,
    required this.imageType,
    required this.notes,
    required this.createdAt,
  });

  factory RestorationImage.fromJson(Map<String, dynamic> json) {
    return RestorationImage(
      id: json['id'].toString(),
      image: json['image'] ?? '',
      imageType: json['image_type'] ?? 'original',
      notes: json['notes'] ?? '',
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }
}
