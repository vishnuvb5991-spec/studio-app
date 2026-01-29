/// Album Model
class Album {
  final String id;
  final String title;
  final String? description;
  final String albumType;
  final String? coverImage;
  final DateTime? eventDate;
  final String status;
  final int photoCount;
  final String studioName;
  final List<Photo> photos;
  final DateTime createdAt;
  
  Album({
    required this.id,
    required this.title,
    this.description,
    required this.albumType,
    this.coverImage,
    this.eventDate,
    required this.status,
    required this.photoCount,
    required this.studioName,
    this.photos = const [],
    required this.createdAt,
  });
  
  factory Album.fromJson(Map<String, dynamic> json) {
    return Album(
      id: json['id'].toString(),
      title: json['title'] ?? '',
      description: json['description'],
      albumType: json['album_type'] ?? 'wedding',
      coverImage: json['cover_image'],
      eventDate: json['event_date'] != null ? DateTime.parse(json['event_date']) : null,
      status: json['status'] ?? 'draft',
      photoCount: json['photo_count'] ?? 0,
      studioName: json['studio_name'] ?? '',
      photos: json['photos'] != null 
          ? (json['photos'] as List).map((p) => Photo.fromJson(p)).toList()
          : [],
      createdAt: DateTime.parse(json['created_at'] ?? DateTime.now().toIso8601String()),
    );
  }
  
  String get albumTypeDisplay => albumType.replaceAll('_', ' ').toUpperCase();
}

/// Photo Model
class Photo {
  final String id;
  final String image;
  final String? thumbnail;
  final String? title;
  final bool isFeatured;
  final bool isDownloadable;
  
  Photo({
    required this.id,
    required this.image,
    this.thumbnail,
    this.title,
    required this.isFeatured,
    required this.isDownloadable,
  });
  
  factory Photo.fromJson(Map<String, dynamic> json) {
    return Photo(
      id: json['id'].toString(),
      image: json['image'] ?? '',
      thumbnail: json['thumbnail'],
      title: json['title'],
      isFeatured: json['is_featured'] ?? false,
      isDownloadable: json['is_downloadable'] ?? true,
    );
  }
}
