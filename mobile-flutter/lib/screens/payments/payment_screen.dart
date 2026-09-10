import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:provider/provider.dart';
import 'package:razorpay_flutter/razorpay_flutter.dart';
import '../../config/theme.dart';
import '../../config/api_config.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/custom_button.dart';

/// Payment Screen with Razorpay Integration
class PaymentScreen extends StatefulWidget {
  final double amount;
  final String paymentType;
  final String? bookingId;
  final String? restorationOrderId;
  
  const PaymentScreen({
    super.key,
    required this.amount,
    required this.paymentType,
    this.bookingId,
    this.restorationOrderId,
  });

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  late Razorpay _razorpay;
  final Dio _dio = Dio();
  bool _isLoading = false;
  String? _paymentId;

  @override
  void initState() {
    super.initState();
    _razorpay = Razorpay();
    _razorpay.on(Razorpay.EVENT_PAYMENT_SUCCESS, _handlePaymentSuccess);
    _razorpay.on(Razorpay.EVENT_PAYMENT_ERROR, _handlePaymentError);
    _razorpay.on(Razorpay.EVENT_EXTERNAL_WALLET, _handleExternalWallet);
  }

  @override
  void dispose() {
    _razorpay.clear();
    super.dispose();
  }

  Future<void> _handlePaymentSuccess(PaymentSuccessResponse response) async {
    final token = context.read<AuthProvider>().token;
    final paymentId = _paymentId;
    if (token == null || paymentId == null || response.orderId == null ||
        response.paymentId == null || response.signature == null) {
      _showError('We could not verify this payment. Please contact support.');
      return;
    }

    setState(() => _isLoading = true);
    try {
      await _dio.post(
        '${ApiConfig.payments}/verify/',
        data: {
          'payment_id': paymentId,
          'razorpay_order_id': response.orderId,
          'razorpay_payment_id': response.paymentId,
          'razorpay_signature': response.signature,
        },
        options: Options(headers: ApiConfig.headers(token)),
      );
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Payment successful!'), backgroundColor: AppColors.success),
      );
      Navigator.pop(context, true);
    } on DioException {
      if (mounted) _showError('Payment received, but verification failed. Please contact support.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _handlePaymentError(PaymentFailureResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Payment Failed: ${response.message}'),
        backgroundColor: AppColors.error,
      ),
    );
  }

  void _handleExternalWallet(ExternalWalletResponse response) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('External Wallet: ${response.walletName}')),
    );
  }

  Future<void> _startPayment() async {
    final token = context.read<AuthProvider>().token;
    if (token == null) {
      _showError('Please sign in before making a payment.');
      return;
    }
    setState(() => _isLoading = true);
    try {
      final order = await _dio.post(
        '${ApiConfig.payments}/create-order/',
        data: {
          'amount': widget.amount.toStringAsFixed(2),
          'payment_type': widget.paymentType,
          if (widget.bookingId != null) 'booking_id': widget.bookingId,
          if (widget.restorationOrderId != null) 'restoration_order_id': widget.restorationOrderId,
        },
        options: Options(headers: ApiConfig.headers(token)),
      );
      _paymentId = order.data['payment_id'] as String?;
      if (_paymentId == null) throw StateError('Missing payment ID');

      final options = {
        'key': order.data['razorpay_key'],
        'order_id': order.data['razorpay_order_id'],
        'amount': order.data['amount'],
        'currency': order.data['currency'],
        'name': order.data['name'],
        'description': order.data['description'],
        'prefill': order.data['prefill'],
        'theme': order.data['theme'],
      };
      _razorpay.open(options);
    } on DioException catch (e) {
      _showError(e.response?.data?['error']?.toString() ?? 'Could not start payment.');
    } catch (_) {
      _showError('Could not start payment. Please try again.');
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message), backgroundColor: AppColors.error),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Payment'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Amount Card
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: AppGradients.primaryGradient,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: [
                  const Text(
                    'Amount to Pay',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '₹${widget.amount.toStringAsFixed(2)}',
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 42,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      widget.paymentType.replaceAll('_', ' ').toUpperCase(),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            
            const SizedBox(height: 30),
            
            // Payment Methods
            Text(
              'Payment Methods',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 16),
            
            _PaymentMethodTile(
              icon: Icons.account_balance_wallet,
              title: 'UPI',
              subtitle: 'Google Pay, PhonePe, Paytm',
              isSelected: true,
            ),
            const SizedBox(height: 12),
            _PaymentMethodTile(
              icon: Icons.credit_card,
              title: 'Card',
              subtitle: 'Credit / Debit Card',
            ),
            const SizedBox(height: 12),
            _PaymentMethodTile(
              icon: Icons.account_balance,
              title: 'Net Banking',
              subtitle: 'All major banks supported',
            ),
            
            const Spacer(),
            
            // Pay Button
            CustomButton(
              text: 'Pay ₹${widget.amount.toStringAsFixed(0)}',
              onPressed: _startPayment,
              isLoading: _isLoading,
              icon: Icons.lock_outline,
            ),
            
            const SizedBox(height: 16),
            
            // Security Note
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.verified_user, size: 16, color: AppColors.success),
                const SizedBox(width: 8),
                Text(
                  'Secured by Razorpay',
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _PaymentMethodTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final bool isSelected;
  
  const _PaymentMethodTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.primary.withOpacity(0.1) : AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isSelected ? AppColors.primary : AppColors.glassBorder,
          width: isSelected ? 2 : 1,
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppColors.primary),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: AppColors.textSecondary,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          if (isSelected)
            const Icon(Icons.check_circle, color: AppColors.primary),
        ],
      ),
    );
  }
}
