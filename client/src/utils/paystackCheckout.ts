export const startPaystackCheckout = ({
    email,
    amount, // In Naira (we will multiply by 100 for kobo)
    jobId,
    duration,
    onSuccess,
    onClose
}: {
    email: string;
    amount: number;
    jobId: number;
    duration: string;
    onSuccess: (reference: any) => void;
    onClose: () => void;
}) => {
    // Paystack expects amounts in Kobo (e.g., ₦5,000 = 500000 kobo)
    const totalAmountInKobo = amount * 100;

    const handler = (window as any).PaystackPop.setup({
        key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxx', // 💡 Replace with your Paystack Public Test Key
        email: email,
        amount: totalAmountInKobo,
        currency: 'NGN',
        ref: `JOB-${jobId}-${Date.now()}`, // Unique transaction reference string
        metadata: {
            jobId: jobId,
            duration: duration
        },
        callback: function (response: any) {
            // This runs when the payment completes successfully on the viewport screen
            console.log('Payment checkout window success token:', response);
            onSuccess(response);
        },
        onClose: function () {
            // User closed the payment popup modal before completing the payment
            onClose();
        }
    });

    handler.openIframe();
};