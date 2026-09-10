const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

/** Load Razorpay Checkout once, only when a user starts a payment. */
export function loadRazorpayCheckout() {
    if (window.Razorpay) return Promise.resolve(window.Razorpay);

    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${RAZORPAY_CHECKOUT_URL}"]`);
        if (existingScript) {
            existingScript.addEventListener('load', () => resolve(window.Razorpay), { once: true });
            existingScript.addEventListener('error', () => reject(new Error('Unable to load Razorpay Checkout.')), { once: true });
            return;
        }

        const script = document.createElement('script');
        script.src = RAZORPAY_CHECKOUT_URL;
        script.async = true;
        script.onload = () => resolve(window.Razorpay);
        script.onerror = () => reject(new Error('Unable to load Razorpay Checkout.'));
        document.head.appendChild(script);
    });
}

/**
 * Open the hosted Razorpay checkout using a server-created order. The server
 * verifies the returned signature before considering the payment complete.
 */
export async function openRazorpayCheckout(order, onSuccess) {
    const Razorpay = await loadRazorpayCheckout();
    if (!Razorpay) throw new Error('Razorpay Checkout is unavailable.');

    return new Promise((resolve, reject) => {
        const checkout = new Razorpay({
            key: order.razorpay_key,
            order_id: order.razorpay_order_id,
            amount: order.amount,
            currency: order.currency,
            name: order.name,
            description: order.description,
            prefill: order.prefill,
            theme: order.theme,
            handler: async (response) => {
                try {
                    await onSuccess(response);
                    resolve();
                } catch (error) {
                    reject(error);
                }
            },
            modal: { ondismiss: () => resolve() },
        });
        checkout.on('payment.failed', (response) => {
            reject(new Error(response.error?.description || 'Payment failed.'));
        });
        checkout.open();
    });
}
