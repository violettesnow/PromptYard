import React, { useState, useEffect } from 'react';

interface PaymentModalProps {
  onClose: () => void;
  onSuccess: () => void;
  userEmail?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess, userEmail }) => {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [loadingText, setLoadingText] = useState('Initiating payment gateway...');

  const handlePayment = () => {
    setStep('processing');
    
    // Simulate multi-stage Stripe processing
    setTimeout(() => setLoadingText('Validating card credentials...'), 800);
    setTimeout(() => setLoadingText('Authorizing transaction with bank...'), 1600);
    setTimeout(() => setLoadingText('Securing your agentic vault...'), 2400);
    
    setTimeout(() => {
      setStep('success');
    }, 3200);
  };

  const handleFinish = () => {
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="max-w-md w-full bg-white rounded-[40px] overflow-hidden shadow-[0_0_80px_rgba(139,92,246,0.3)] text-obsidian-950 transition-all duration-500">
        
        {step === 'details' && (
          <div className="p-10 space-y-8 animate-subtle-rise">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                   <h2 className="text-2xl font-display font-black tracking-tight uppercase">PromptYard Pro</h2>
                </div>
                <p className="text-[10px] text-obsidian-500 font-black uppercase tracking-[0.2em]">Unlock Infinite Intelligence</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-obsidian-100 rounded-full transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="flex items-baseline gap-1 bg-obsidian-50 p-6 rounded-3xl border border-obsidian-100">
              <span className="text-5xl font-display font-black">$9.99</span>
              <span className="text-obsidian-500 font-bold text-sm tracking-tight">/ month</span>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-obsidian-400 tracking-widest ml-1">Payment Email</label>
                <input disabled defaultValue={userEmail || "user@promptyard.ai"} className="w-full px-5 py-4 bg-obsidian-50 border border-obsidian-200 rounded-2xl text-xs font-bold outline-none text-obsidian-400" />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-obsidian-400 tracking-widest ml-1">Card Information</label>
                <div className="border border-obsidian-200 rounded-2xl overflow-hidden divide-y divide-obsidian-100 shadow-sm">
                  <div className="relative">
                    <input placeholder="4242 4242 4242 4242" className="w-full px-5 py-4 bg-white text-xs font-mono outline-none focus:bg-obsidian-50 transition-colors" />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                      <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                      <div className="w-6 h-4 bg-orange-500 rounded-sm"></div>
                    </div>
                  </div>
                  <div className="flex divide-x divide-obsidian-100">
                    <input placeholder="MM / YY" className="w-1/2 px-5 py-4 bg-white text-xs font-mono outline-none focus:bg-obsidian-50 transition-colors" />
                    <input placeholder="CVC" className="w-1/2 px-5 py-4 bg-white text-xs font-mono outline-none focus:bg-obsidian-50 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                onClick={handlePayment}
                className="w-full py-5 bg-obsidian-950 text-white font-display font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-obsidian-800 transition-all shadow-xl shadow-obsidian-200 active:scale-[0.98]"
              >
                Start Subscription
              </button>
              
              <div className="flex items-center justify-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                <svg className="w-3.5 h-3.5" viewBox="0 0 40 40" fill="currentColor"><path d="M11 20.3h2V15c0-4.4 3.6-8 8-8s8 3.6 8 8v5.3h2v-5.3c0-5.5-4.5-10-10-10s-10 4.5-10 10v5.3z"/><path d="M34 20.3H8c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3h26c1.7 0 3-1.3 3-3v-13c0-1.7-1.3-3-3-3z"/></svg>
                <span className="text-[8px] font-black uppercase tracking-widest">Guaranteed secure by Stripe</span>
              </div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in">
            <div className="relative">
              <div className="w-24 h-24 border-[6px] border-brand-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-brand-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-display font-black uppercase tracking-tighter">Secure Handshake</h3>
              {/* Fix: Replaced undefined 'loadingMsg' with existing 'loadingText' state variable */}
              <p className="text-[10px] text-obsidian-400 font-bold uppercase tracking-widest animate-pulse">{loadingText}</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-16 flex flex-col items-center justify-center text-center space-y-8 animate-subtle-rise">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 animate-check">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-display font-black uppercase tracking-tighter">Access Unlocked</h3>
              <p className="text-[11px] text-obsidian-500 font-medium leading-relaxed max-w-[240px] mx-auto">
                Welcome to the Pro Yard. All agentic features and deep sync capabilities are now online.
              </p>
            </div>
            <button 
              onClick={handleFinish}
              className="px-10 py-4 bg-obsidian-950 text-white font-display font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-obsidian-800 transition-all"
            >
              Continue to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;