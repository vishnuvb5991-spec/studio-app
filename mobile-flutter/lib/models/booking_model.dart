/// Booking Model
class Booking {
  final String id;
  final String eventName;
  final String eventType;
  final DateTime eventDate;
  final String status;
  final double totalAmount;
  final bool advancePaid;
  final String customerName;
  final String studioName;
  final String? venueAddress;
  final DateTime createdAt;
  
  Booking({
    required this.id,
    required this.eventName,
    required this.eventType,
    required this.eventDate,
    required this.status,
    required this.totalAmount,
    required this.advancePaid,
    required this.customerName,
    required this.studioName,
    this.venueAddress,
    required this.createdAt,
  });
  
  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'].toString(),
      eventName: json['event_name'] ?? '',
      eventType: json['event_type'] ?? 'wedding',
      eventDate: DateTime.parse(json['event_date'] ?? DateTime.now().toIso8601String()),
      status: json['status'] ?? 'pending',
      totalAmount: double.tryParse(json['total_amount'].toString()) ?? 0,
      advancePaid: json['advance_paid'] ?? false,
      customerName: json['customer_name'] ?? '',
      studioName: json['studio_name'] ?? '',
      venueAddress: json['venue_address'],
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }
  
  String get eventTypeDisplay => eventType.replaceAll('_', ' ').toUpperCase();
  String get statusDisplay => status.toUpperCase();
  
  bool get isPending => status == 'pending';
  bool get isConfirmed => status == 'confirmed';
  bool get isCompleted => status == 'completed';
}
