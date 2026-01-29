import 'package:go_router/go_router.dart';
import '../screens/splash_screen.dart';
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/home/home_screen.dart';
import '../screens/albums/albums_screen.dart';
import '../screens/albums/album_detail_screen.dart';
import '../screens/bookings/bookings_screen.dart';
import '../screens/bookings/create_booking_screen.dart';
import '../screens/restoration/restoration_screen.dart';
import '../screens/payments/payment_screen.dart';
import '../screens/profile/profile_screen.dart';

/// App Router Configuration
class AppRouter {
  static final router = GoRouter(
    initialLocation: '/',
    routes: [
      // Splash Screen
      GoRoute(
        path: '/',
        builder: (context, state) => const SplashScreen(),
      ),
      
      // Auth Routes
      GoRoute(
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      
      // Main App Routes
      GoRoute(
        path: '/home',
        builder: (context, state) => const HomeScreen(),
      ),
      
      // Albums
      GoRoute(
        path: '/albums',
        builder: (context, state) => const AlbumsScreen(),
      ),
      GoRoute(
        path: '/albums/:id',
        builder: (context, state) => AlbumDetailScreen(
          albumId: state.pathParameters['id']!,
        ),
      ),
      
      // Bookings
      GoRoute(
        path: '/bookings',
        builder: (context, state) => const BookingsScreen(),
      ),
      GoRoute(
        path: '/bookings/create',
        builder: (context, state) => const CreateBookingScreen(),
      ),
      
      // Restoration
      GoRoute(
        path: '/restoration',
        builder: (context, state) => const RestorationScreen(),
      ),
      
      // Payments
      GoRoute(
        path: '/payment',
        builder: (context, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return PaymentScreen(
            amount: extra?['amount'] ?? 0,
            paymentType: extra?['paymentType'] ?? 'other',
            bookingId: extra?['bookingId'],
          );
        },
      ),
      
      // Profile
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileScreen(),
      ),
    ],
  );
}
