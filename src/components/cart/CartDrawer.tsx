import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles,
  Info
} from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    language,
    isCartOpen,
    setIsCartOpen,
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    settings,
  } = useRestaurant();

  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ success: boolean; message: string } | null>(null);

  if (!isCartOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    setPromoFeedback(res);
    if (res.success) {
      setPromoInput('');
    }
  };

  const freeDeliveryRemainder = Math.max(0, settings.freeDeliveryThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div 
          className="w-screen max-w-md bg-white text-[#121417] shadow-2xl flex flex-col justify-between border-l border-[#E8E2D6] animate-in slide-in-from-right duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cart-drawer-title"
        >
          
          {/* Header */}
          <div className="p-6 bg-[#FAF8F5] border-b border-[#E8E2D6] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-[#121417] text-[#FAF8F5] rounded-xl shadow-sm">
                <ShoppingBag className="w-5 h-5 text-[#C5A059]" />
              </div>
              <div>
                <h2 id="cart-drawer-title" className="font-serif text-xl font-semibold text-[#121417]">
                  {language === 'bs' ? 'Vaša Korpa' : 'Your Order Cart'}
                </h2>
                <span className="text-xs text-[#C5A059] font-medium tracking-wide">
                  {cart.length} {language === 'bs' ? 'stavki' : 'items'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-[#121417] hover:bg-[#FAF8F5] transition-colors"
              aria-label="Zatvori korpu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Bar */}
          {settings.isDeliveryEnabled && (
            <div className="bg-[#FAF8F5]/80 px-6 py-2.5 border-b border-[#E8E2D6] text-xs">
              {freeDeliveryRemainder > 0 ? (
                <div className="flex items-center gap-2 text-[#121417]/80">
                  <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>
                    {language === 'bs' 
                      ? `Dodajte još ${freeDeliveryRemainder.toFixed(2)} KM za besplatnu dostavu!`
                      : `Add ${freeDeliveryRemainder.toFixed(2)} KM more for free delivery!`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {language === 'bs' 
                      ? 'Čestitamo! Ostvarili ste besplatnu dostavu!' 
                      : 'Congratulations! You unlocked free delivery!'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#F7F4ED] text-stone-400 mx-auto flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#20221F]">
                  {language === 'bs' ? 'Vaša korpa je prazna' : 'Your cart is empty'}
                </h3>
                <p className="text-xs text-[#20221F]/60 max-w-xs mx-auto">
                  {language === 'bs'
                    ? 'Pregledajte naš digitalni meni i dodajte omiljena jela i pića.'
                    : 'Explore our digital menu to add handcrafted dishes and fine wines.'}
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-2xl border border-[#E8E2D6] bg-[#FAF8F5]/50 hover:bg-[#FAF8F5] transition-colors flex gap-3 items-start"
                >
                  <img
                    src={item.menuItem.imageUrl}
                    alt={item.menuItem.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-[#E8E2D6]"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="text-xs font-bold text-[#121417] truncate">
                        {language === 'bs' ? item.menuItem.name : item.menuItem.nameEn}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="text-stone-400 hover:text-rose-600 p-0.5 transition-colors"
                        title={language === 'bs' ? 'Ukloni' : 'Remove'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Variant and Extras details */}
                    {item.selectedVariant && (
                      <p className="text-[11px] text-[#C5A059] font-medium">
                        {language === 'bs' ? item.selectedVariant.name : item.selectedVariant.nameEn}
                      </p>
                    )}

                    {item.selectedExtras.length > 0 && (
                      <p className="text-[10px] text-stone-500 truncate">
                        +{item.selectedExtras.map((e) => (language === 'bs' ? e.name : e.nameEn)).join(', ')}
                      </p>
                    )}

                    {item.specialInstructions && (
                      <p className="text-[10px] text-stone-500 italic truncate mt-0.5">
                        &quot;{item.specialInstructions}&quot;
                      </p>
                    )}

                    {/* Price and Quantity Controls */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#E8E2D6]/40">
                      <span className="font-serif text-sm font-bold text-[#C5A059]">
                        {item.lineTotal.toFixed(2)} KM
                      </span>

                      <div className="flex items-center border border-[#E8E2D6] bg-white rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, -1)}
                          className="p-1 text-stone-600 hover:text-[#121417] transition-colors"
                          aria-label="Smanji količinu"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-[#121417]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.cartItemId, 1)}
                          className="p-1 text-stone-600 hover:text-[#121417] transition-colors"
                          aria-label="Povećaj količinu"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Calculations & Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#FAF8F5] border-t border-[#E8E2D6] space-y-4">
              
              {/* Promo code form */}
              {appliedPromo ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Kod: <strong>{appliedPromo.code}</strong> (-{discountAmount.toFixed(2)} KM)</span>
                  </div>
                  <button
                    onClick={removePromoCode}
                    className="text-stone-400 hover:text-rose-600 font-bold"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder={language === 'bs' ? 'Unesite kupon (npr. ATELIER15)' : 'Promo code (e.g. ATELIER15)'}
                      className="text-xs uppercase px-3 py-2 rounded-xl border border-[#E8E2D6] bg-white focus:outline-none focus:border-[#C5A059] flex-1"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-[#121417] text-white text-xs font-semibold hover:bg-[#C5A059] hover:text-[#121417] transition-colors"
                    >
                      {language === 'bs' ? 'Primijeni' : 'Apply'}
                    </button>
                  </div>
                  {promoFeedback && (
                    <p className={`text-[11px] ${promoFeedback.success ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {promoFeedback.message}
                    </p>
                  )}
                </form>
              )}

              {/* Subtotal, delivery, total */}
              <div className="space-y-1.5 text-xs text-[#121417]/80">
                <div className="flex justify-between">
                  <span>{language === 'bs' ? 'Međuzbir' : 'Subtotal'}</span>
                  <span className="font-semibold text-[#121417]">{cartSubtotal.toFixed(2)} KM</span>
                </div>

                {settings.isDeliveryEnabled && (
                  <div className="flex justify-between">
                    <span>{language === 'bs' ? 'Dostava (Sarajevo zona)' : 'Standard Delivery'}</span>
                    <span className="font-semibold text-[#121417]">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 uppercase font-bold">{language === 'bs' ? 'Besplatno' : 'Free'}</span>
                      ) : (
                        `${deliveryFee.toFixed(2)} KM`
                      )}
                    </span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>{language === 'bs' ? 'Popust' : 'Discount'}</span>
                    <span>-{discountAmount.toFixed(2)} KM</span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-bold text-[#121417] pt-2 border-t border-[#E8E2D6]">
                  <span>{language === 'bs' ? 'Ukupno za plaćanje' : 'Final Total'}</span>
                  <span className="font-serif text-lg text-[#C5A059] font-bold">{cartTotal.toFixed(2)} KM</span>
                </div>
              </div>

              {/* Proceed to checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 px-6 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#121417] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>{language === 'bs' ? 'Nastavi na Plaćanje' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-[11px] text-stone-400 hover:text-stone-700 transition-colors"
              >
                {language === 'bs' ? 'Isprazni korpu' : 'Clear entire cart'}
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
