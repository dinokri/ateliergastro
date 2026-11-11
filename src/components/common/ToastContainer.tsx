import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useRestaurant();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 transition-all duration-300 transform translate-y-0 backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-[#121417]/95 text-[#FAF8F5] border-emerald-500/40'
              : toast.type === 'error'
              ? 'bg-rose-950/95 text-rose-50 border-rose-800/60'
              : 'bg-[#121417]/95 text-[#FAF8F5] border-[#C5A059]/50'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />}

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold tracking-wide">{toast.title}</h4>
            <p className="text-xs text-[#FAF8F5]/80 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-stone-400 hover:text-stone-100 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
            aria-label="Zatvori notifikaciju"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
