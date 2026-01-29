import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../config/theme.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/glassmorphism_card.dart';

class RestorationScreen extends StatefulWidget {
  const RestorationScreen({super.key});

  @override
  State<RestorationScreen> createState() => _RestorationScreenState();
}

class _RestorationScreenState extends State<RestorationScreen> {
  final ImagePicker _picker = ImagePicker();
  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Photo Restoration')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // How it works card
            _buildInfoCard(),
            
            const SizedBox(height: 30),
            
            Text(
              'My Orders',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            
            // Empty state for now
            _buildEmptyState(),
            
            const SizedBox(height: 40),
            
            CustomButton(
              text: 'Upload Photo for Restoration',
              onPressed: _pickImage,
              icon: Icons.cloud_upload_outlined,
            ).animate().shimmer(delay: 1.seconds, duration: 2.seconds),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoCard() {
    return GlassmorphismCard(
      child: Column(
        children: [
          Row(
            children: [
              Icon(Icons.auto_fix_high, color: AppColors.accent, size: 32),
              const SizedBox(width: 16),
              const Expanded(
                child: Text(
                  'Breathe New Life into Old Memories',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Text(
            'We specialize in restoring damaged, faded, or torn photos. Digital colorization and enhancement available.',
            style: TextStyle(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      padding: const EdgeInsets.all(40),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Column(
        children: [
          Icon(Icons.history, size: 48, color: AppColors.textMuted),
          const SizedBox(height: 16),
          Text(
            'No restoration orders yet',
            style: TextStyle(color: AppColors.textSecondary),
          ),
        ],
      ),
    );
  }

  Future<void> _pickImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      // TODO: Handle upload
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Uploading photo...')),
        );
      }
    }
  }
}
