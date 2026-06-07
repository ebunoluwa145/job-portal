import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { useManageJobs } from '../features/admin/api/useManageJobs'; 

export const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Retrieve the context data with safe fallback mechanisms
    const { jobId, email, title } = location.state || { jobId: null, email: '', title: 'Job Listing' };

    const [selectedPackage, setSelectedPackage] = useState<'1m' | '3m' | '6m'>('1m');
    const [isSavingDatabase, setIsSavingDatabase] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Pull in your existing status mutation hook to trigger database writes
    const { updateJobStatus } = useManageJobs('employee');

    // Define your pricing packages in Naira
    const packages = {
        '1m': { name: '1 Month Kickstart', price: 15000, durationText: '30 Days Active', savings: null },
        '3m': { name: '3 Month Growth', price: 35000, durationText: '90 Days Active', savings: 'Save ₦10,000' },
        '6m': { name: '6 Month Premium', price: 60000, durationText: '180 Days Active', savings: 'Save ₦30,000' }
    };

    const currentPackage = packages[selectedPackage];

    const handlePayment = () => {
        const verifiedJobId = jobId;
        const verifiedEmail = email || 'customer@hiring.com';

        if (!verifiedJobId) {
            alert("Missing job reference ID. Please navigate back to the dashboard and try again.");
            return;
        }

        const totalAmountInKobo = currentPackage.price * 100;
        
        const handler = (window as any).PaystackPop.setup({
            key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
            email: verifiedEmail,
            amount: totalAmountInKobo,
            currency: 'NGN',
            ref: `JOB-${verifiedJobId}-${Date.now()}`,
            metadata: {
                jobId: String(verifiedJobId),
                duration: selectedPackage 
            },
            // 🟢 FIRES ONLY AFTER SUCCESSFUL PAYSTACK WINDOW VERIFICATION
            callback: function (response: any) {
                console.log('Paystack verified transaction token:', response);
                
                // Turn on full screen database loader
                setIsSavingDatabase(true);

                // 1. Calculate expiration timestamps based on selection
                const expiryDate = new Date();
                if (selectedPackage === '3m') {
                    expiryDate.setMonth(expiryDate.getMonth() + 3);
                } else if (selectedPackage === '6m') {
                    expiryDate.setMonth(expiryDate.getMonth() + 6);
                } else {
                    expiryDate.setMonth(expiryDate.getMonth() + 1);
                }

                // 2. ⚡ STRUCTURE PAYLOAD EXPLICITLY FOR YOUR HONO PUT ROUTE
                // Forces ID to a pure Number, updates to true Booleans
                const updatePayload = {
                    id: Number(verifiedJobId), 
                    updates: {
                        paymentStatus: 1,          // Strict SQL Boolean Match
                        isFeatured: 1,             // Strict SQL Boolean Match
                        status: 'active',             // Set live on feed directly
                        featuredUntil: expiryDate.toISOString()
                    }
                };

                console.log("Payment completed successfully! Syncing parameters:", updatePayload);

                // 3. Execute mutation via your manage jobs React Query hook
                try {
                    updateJobStatus(updatePayload as any);
                    
                    // Allow server network round-trip time before advancing view state
                    setTimeout(() => {
                        setIsSavingDatabase(false);
                        setPaymentSuccess(true);
                    }, 1500);
                } catch (error) {
                    console.error("Database status sync failure:", error);
                    setIsSavingDatabase(false);
                    alert("Payment captured, but database synchronization dropped. Please check your main dashboard.");
                }
            },
            onClose: function () {
                alert('Transaction paused. Premium featured status can be completed anytime from your dashboard.');
            }
        });

        handler.openIframe();
    };

    // 🛑 VIEW STATE 1: LOADING OVERLAY WHILST RE-WRITING DATABASE DATA FIELDS
    if (isSavingDatabase) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full p-8 border border-slate-200 rounded-2xl bg-white text-center shadow-xl flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-indigo-600" size={40} />
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Verifying Transaction...</h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        Securely registering your subscription and activating your premium featured status. Please don't close your window.
                    </p>
                </div>
            </div>
        );
    }

    // 🛑 VIEW STATE 2: SUCCESS RECEIPT CONTEXT LAYER
    if (paymentSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full p-8 border border-slate-200 rounded-2xl bg-white text-center shadow-xl animate-in fade-in zoom-in duration-200">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 mb-2">Payment Successful!</h2>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Your listing <span className="font-bold text-slate-800">"{title}"</span> is now verified, fully featured ({currentPackage.durationText}), and live on the public feed.
                    </p>
                    <button 
                        onClick={() => navigate('/dashboard', { replace: true })}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest py-4 rounded-xl text-xs transition-all"
                    >
                        Go To Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // 🛑 VIEW STATE 3: ILLEGAL ACCESS HANDLER (FALLBACK REJECTION)
    if (!jobId) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full p-8 border border-slate-200 rounded-2xl bg-white text-center shadow-sm">
                    <p className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">
                        No Active Job Selected for Checkout
                    </p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-xl transition-all"
                    >
                        Return To Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // 🌟 DEFAULT APP BASE VIEW: SELECTION PRICING SYSTEM INTERFACE
    return (
        <div className="min-h-screen bg-slate-50 py-16 px-4">
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
                
                {/* Header Banner */}
                <div className="bg-slate-900 p-8 text-white text-center relative">
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-1 rounded tracking-widest mb-3 inline-block">
                        Premium Feature Upgrades
                    </span>
                    <h1 className="text-2xl font-black uppercase tracking-tight">Promote Your Job Post</h1>
                    <p className="text-slate-400 text-sm mt-1">Supercharge visibility for: <span className="text-white font-bold">{title}</span></p>
                </div>

                {/* Package Selectors Grid */}
                <div className="p-8 space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Select Duration Package</h3>
                    
                    {Object.entries(packages).map(([key, pkg]) => (
                        <div 
                            key={key}
                            onClick={() => setSelectedPackage(key as any)}
                            className={`border-2 rounded-xl p-5 cursor-pointer transition-all flex justify-between items-center ${
                                selectedPackage === key 
                                    ? 'border-indigo-600 bg-indigo-50/40 shadow-sm' 
                                    : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                    selectedPackage === key ? 'border-indigo-600' : 'border-slate-300'
                                }`}>
                                    {selectedPackage === key && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 uppercase text-sm tracking-tight">{pkg.name}</h4>
                                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                        <Calendar size={12} /> {pkg.durationText}
                                    </span>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <span className="text-lg font-black text-slate-900">₦{pkg.price.toLocaleString()}</span>
                                {pkg.savings && (
                                    <div className="text-[10px] text-green-600 font-black uppercase tracking-tight mt-0.5 bg-green-50 px-1.5 py-0.5 rounded">
                                        {pkg.savings}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Order Summary & Call To Action */}
                    <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50 -mx-8 -mb-8 p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase">Total Commitment</span>
                                <p className="text-slate-500 text-xs font-medium uppercase">{currentPackage.name}</p>
                            </div>
                            <span className="text-3xl font-black text-slate-900 tracking-tighter">
                                ₦{currentPackage.price.toLocaleString()}
                            </span>
                        </div>

                        <button
                            onClick={handlePayment}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                        >
                            <CreditCard size={18} />
                            Pay Securely via Paystack
                        </button>
                        
                        <p className="text-center text-[10px] text-slate-400 mt-4 font-medium uppercase tracking-wider">
                            🔒 Secured via Paystack payment networks. Cancel or modify anytime.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};