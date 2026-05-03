'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { mockCart, getCartSummary } from '@/mocks/cart';

/**
 * S-11, S-12, S-13 — Multi-step Checkout
 * Route: /(renter)/checkout
 */
export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const summary = getCartSummary(mockCart);

  // Form State
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentPlan, setPaymentPlan] = useState<'upfront' | 'weekly' | 'monthly'>('upfront');
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    pincode: '',
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleComplete = () => {
    // PHASE4-SWAP: Process payment and create order
    router.push('/(renter)/checkout/success');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-12">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            step === s ? 'bg-[#1886FF] text-white shadow-lg scale-110' : 
            step > s ? 'bg-green-500 text-white' : 'bg-[#E5E5E5] text-[#737373]'
          }`}>
            {step > s ? '✓' : s}
          </div>
          {s < 3 && <div className={`w-12 h-0.5 rounded-full ${step > s ? 'bg-green-500' : 'bg-[#E5E5E5]'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center">
        <h1 className="text-3xl font-black text-[#171717] tracking-tight">Checkout</h1>
        <p className="text-[#737373] mt-2">Complete your booking securely</p>
      </div>

      {renderStepIndicator()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Steps */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* STEP 1: Delivery & Plan (S-11) */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <section className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-sm">
                <h2 className="text-lg font-bold text-[#171717] mb-6">Delivery Method</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDeliveryMethod('delivery')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      deliveryMethod === 'delivery' ? 'border-[#1886FF] bg-[#E4F9FF]' : 'border-[#E5E5E5] hover:border-[#1886FF]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mb-3 flex items-center justify-center ${
                      deliveryMethod === 'delivery' ? 'border-[#1886FF]' : 'border-[#E5E5E5]'
                    }`}>
                      {deliveryMethod === 'delivery' && <div className="w-2.5 h-2.5 rounded-full bg-[#1886FF]" />}
                    </div>
                    <p className="font-bold text-sm text-[#171717]">Home Delivery</p>
                    <p className="text-[10px] text-[#737373] mt-1">Get it delivered at your doorstep (₹250)</p>
                  </button>
                  <button 
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      deliveryMethod === 'pickup' ? 'border-[#1886FF] bg-[#E4F9FF]' : 'border-[#E5E5E5] hover:border-[#1886FF]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 mb-3 flex items-center justify-center ${
                      deliveryMethod === 'pickup' ? 'border-[#1886FF]' : 'border-[#E5E5E5]'
                    }`}>
                      {deliveryMethod === 'pickup' && <div className="w-2.5 h-2.5 rounded-full bg-[#1886FF]" />}
                    </div>
                    <p className="font-bold text-sm text-[#171717]">Self Pickup</p>
                    <p className="text-[10px] text-[#737373] mt-1">Pick it up from lister&apos;s location (Free)</p>
                  </button>
                </div>
              </section>

              <section className="bg-white p-6 rounded-3xl border border-[#E5E5E5] shadow-sm">
                <h2 className="text-lg font-bold text-[#171717] mb-6">Choose Payment Plan</h2>
                <div className="space-y-4">
                  {[
                    { id: 'upfront', label: 'Full Upfront', desc: 'Pay total rent now and save 5% on next booking.' },
                    { id: 'weekly', label: 'Weekly Plan', desc: 'Pay in easy installments every week.' },
                    { id: 'monthly', label: 'Monthly Subscription', desc: 'Auto-debit every month for long-term rentals.' },
                  ].map((plan) => (
                    <button 
                      key={plan.id}
                      onClick={() => setPaymentPlan(plan.id as any)}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all ${
                        paymentPlan === plan.id ? 'border-[#1886FF] bg-[#E4F9FF]' : 'border-[#E5E5E5] hover:border-[#1886FF]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        paymentPlan === plan.id ? 'border-[#1886FF]' : 'border-[#E5E5E5]'
                      }`}>
                        {paymentPlan === plan.id && <div className="w-2.5 h-2.5 rounded-full bg-[#1886FF]" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#171717]">{plan.label}</p>
                        <p className="text-[10px] text-[#737373]">{plan.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* STEP 2: Address (S-12) */}
          {step === 2 && (
            <section className="bg-white p-8 rounded-3xl border border-[#E5E5E5] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-bold text-[#171717] mb-8">Delivery Address</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] text-sm focus:ring-2 focus:ring-[#62D0FF] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="+91"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] text-sm focus:ring-2 focus:ring-[#62D0FF] outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Street Address</label>
                  <input 
                    type="text" 
                    placeholder="House no, Building, Street"
                    className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] text-sm focus:ring-2 focus:ring-[#62D0FF] outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">City</label>
                    <input 
                      type="text" 
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] text-sm focus:ring-2 focus:ring-[#62D0FF] outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#737373] uppercase tracking-wider">Pincode</label>
                    <input 
                      type="text" 
                      placeholder="400001"
                      className="w-full px-4 py-3 rounded-xl border border-[#E5E5E5] text-sm focus:ring-2 focus:ring-[#62D0FF] outline-none"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* STEP 3: Confirm & Pay (S-13) */}
          {step === 3 && (
            <section className="bg-white p-8 rounded-3xl border border-[#E5E5E5] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-bold text-[#171717] mb-8">Select Payment Method</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { id: 'upi', label: 'UPI (GPay/PhonePe)', icon: '📱' },
                  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
                  { id: 'net', label: 'Net Banking', icon: '🏦' },
                  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
                ].map((pm) => (
                  <button 
                    key={pm.id}
                    className="p-6 rounded-2xl border-2 border-[#E5E5E5] hover:border-[#1886FF] hover:bg-[#E4F9FF] flex items-center gap-4 transition-all group"
                  >
                    <span className="text-2xl">{pm.icon}</span>
                    <span className="font-bold text-sm text-[#171717] group-hover:text-[#1886FF]">{pm.label}</span>
                  </button>
                ))}
              </div>
              <div className="mt-8 p-4 bg-yellow-50 rounded-2xl border border-yellow-200 flex gap-4">
                <span className="text-xl">🛡️</span>
                <p className="text-[10px] text-yellow-800 font-medium">
                  Your payment is protected by <strong>Rentify SafeShield</strong>. Money is held in escrow until you confirm the item is in good condition.
                </p>
              </div>
            </section>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="px-8 py-3 rounded-xl border-2 border-[#171717] text-xs font-black uppercase tracking-widest hover:bg-[#171717] hover:text-white transition-all"
              >
                Back
              </button>
            ) : (
              <Link 
                href="/(renter)/cart"
                className="px-8 py-3 rounded-xl border-2 border-[#E5E5E5] text-xs font-bold text-[#737373] hover:border-[#171717] hover:text-[#171717] transition-all"
              >
                Cancel
              </Link>
            )}
            
            {step < 3 ? (
              <button 
                onClick={nextStep}
                className="px-10 py-3 rounded-xl bg-[#1886FF] text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[#62D0FF] transition-all"
              >
                Continue
              </button>
            ) : (
              <button 
                onClick={handleComplete}
                className="px-12 py-3 rounded-xl bg-green-500 text-white text-xs font-black uppercase tracking-widest shadow-lg hover:bg-green-600 transition-all"
              >
                Confirm & Pay ₹{summary.total.toLocaleString()}
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-[#E5E5E5] p-6 shadow-sm">
            <h2 className="text-sm font-bold text-[#171717] mb-6 uppercase tracking-wider">Order Summary</h2>
            <div className="space-y-4">
              {mockCart.map(item => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#F5F5F5] shrink-0">
                    <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#171717] truncate">{item.product.title}</p>
                    <p className="text-[10px] text-[#737373]">{item.totalDays} days</p>
                  </div>
                </div>
              ))}
              
              <div className="pt-4 border-t border-[#E5E5E5] space-y-3">
                <div className="flex justify-between text-xs text-[#737373]">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{summary.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-[#737373]">
                  <span>Delivery</span>
                  <span className="font-semibold">{deliveryMethod === 'delivery' ? '₹250' : 'Free'}</span>
                </div>
                <div className="flex justify-between text-xs text-[#737373]">
                  <span>Security Deposit</span>
                  <span className="font-semibold">₹{summary.totalDeposit.toLocaleString()}</span>
                </div>
                <div className="pt-3 border-t border-[#E5E5E5] flex justify-between items-baseline">
                  <span className="font-bold text-[#171717]">Total</span>
                  <span className="text-xl font-black text-[#1886FF]">₹{summary.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
