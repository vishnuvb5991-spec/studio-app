import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/album_provider.dart';
import '../../models/album_model.dart';

class AlbumDetailScreen extends StatefulWidget {
  final String albumId;
  const AlbumDetailScreen({super.key, required this.albumId});

  @override
  State<AlbumDetailScreen> createState() => _AlbumDetailScreenState();
}

class _AlbumDetailScreenState extends State<AlbumDetailScreen> {
  @override
  void initState() {
    super.initState();
    _loadAlbumDetail();
  }

  void _loadAlbumDetail() {
    final auth = context.read<AuthProvider>();
    if (auth.token != null) {
      context.read<AlbumProvider>().fetchAlbumDetail(widget.albumId, auth.token!);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<AlbumProvider>(
        builder: (context, provider, _) {
          final album = provider.selectedAlbum;

          if (provider.isLoading && album == null) {
            return const Center(child: CircularProgressIndicator());
          }

          if (album == null) {
            return const Center(child: Text('Album not found'));
          }

          return CustomScrollView(
            slivers: [
              _buildAppBar(context, album),
              _buildPhotoGrid(context, album),
            ],
          );
        },
      ),
    );
  }

  Widget _buildAppBar(BuildContext context, Album album) {
    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      backgroundColor: AppColors.background,
      flexibleSpace: FlexibleSpaceBar(
        title: Text(
          album.title,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            shadows: [Shadow(blurRadius: 10, color: Colors.black)],
          ),
        ),
        background: Stack(
          fit: StackFit.expand,
          children: [
            if (album.coverImage != null)
              CachedNetworkImage(
                imageUrl: album.coverImage!,
                fit: BoxFit.cover,
              )
            else
              Container(color: AppColors.surface),
            const DecoratedBox(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, Colors.black54],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPhotoGrid(BuildContext context, Album album) {
    if (album.photos.isEmpty) {
      return const SliverFillRemaining(
        child: Center(child: Text('No photos in this album')),
      );
    }

    return SliverPadding(
      padding: const EdgeInsets.all(4),
      sliver: SliverMasonryGrid.count(
        crossAxisCount: 2,
        mainAxisSpacing: 4,
        crossAxisSpacing: 4,
        itemBuilder: (context, index) {
          final photo = album.photos[index];
          return GestureDetector(
            onTap: () => _openGallery(context, album.photos, index),
            child: Hero(
              tag: photo.id,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: CachedNetworkImage(
                  imageUrl: photo.image,
                  placeholder: (context, url) => Container(
                    color: AppColors.surface,
                    height: 200,
                  ),
                  fit: BoxFit.cover,
                ),
              ),
            ),
          )
          .animate()
          .fadeIn(delay: (index * 50).ms)
          .scale(begin: const Offset(0.9, 0.9), end: const Offset(1, 1));
        },
        childCount: album.photos.length,
      ),
    );
  }

  void _openGallery(BuildContext context, List<Photo> photos, int index) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PhotoGalleryScreen(
          photos: photos,
          initialIndex: index,
        ),
      ),
    );
  }
}

class PhotoGalleryScreen extends StatelessWidget {
  final List<Photo> photos;
  final int initialIndex;

  const PhotoGalleryScreen({
    super.key,
    required this.photos,
    required this.initialIndex,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: PhotoViewGallery.builder(
        itemCount: photos.length,
        builder: (context, index) {
          return PhotoViewGalleryPageOptions(
            imageProvider: NetworkImage(photos[index].image),
            heroAttributes: PhotoViewHeroAttributes(tag: photos[index].id),
            minScale: PhotoViewComputedScale.contained,
            maxScale: PhotoViewComputedScale.covered * 2,
          );
        },
        scrollPhysics: const BouncingScrollPhysics(),
        backgroundDecoration: const BoxDecoration(color: Colors.black),
        pageController: PageController(initialPage: initialIndex),
      ),
    );
  }
}
