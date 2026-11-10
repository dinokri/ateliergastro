import React, { useState } from 'react';
import { MenuItem, ItemVariant, ItemExtra } from '../../types/restaurant';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, Clock, Flame, AlertTriangle, Plus, Minus, Check, ShoppingBag } from 'lucide-react';
import { calculateItemUnitPrice } from '../../utils/pricing';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose }) => {
  const { language, addToCart } = useRestaurant();

  if (!dish) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | undefined>(
    dish.variants && dish.variants.length > 0 ? dish.variants[0] : undefined
  );
  const [selectedExtras, setSelectedExtras] = useState<ItemExtra[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');

  const toggleExtra = (extra: ItemExtra) => {
    setSelectedExtras((prev) => {
      const exists = prev.some((e) => e.id === extra.id);
      if (exists) {
        return prev.filter((e) => e.id !== extra.id);
      } else {
        return [...prev, extra];
      }
    });
  };

  const unitPrice = calculateItemUnitPrice(dish.price, selectedVariant, selectedExtras);
  const totalPrice = (Math.round(unitPrice * 100) * quantity) / 100;

  const handleAddToCart = () => {
    addToCart(
      dish,
      quantity,
      selectedVariant?.id,
      selectedExtras.map((e) => e.id),
      specialInstructions.trim() || undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white text-[#20221F] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#E9E1D4] max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dish-modal-title"
      >
        {/* Modal Header Image */}
        <div className="relative h-64 sm:h-72 w-full bg-[#E9E1D4]/40 shrink-0">
          <img
            src={dish.imageUrl}
            alt={language === 'bs' ? dish.name : dish.nameEn}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
            }}
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-[#20221F]/80 hover:bg-[#20221F] text-white shadow-lg transition-transform hover:scale-105"
            aria-label="Zatvori prozor sa detaljima"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
            {dish.isChefRecommendation && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#59634A] text-white shadow">
                {language === 'bs' ? 'Chef’s Choice' : 'Chef’s Choice'}
              </span>
            )}
            {dish.isBestseller && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B66F52] text-white shadow">
                Bestseller
              </span>
            )}
            {!dish.isAvailable && (
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-700 text-white shadow">
                {language === 'bs' ? 'Rasprodano' : 'Out of Stock'}
              </span>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <h2 id="dish-modal-title" className="font-serif text-2xl sm:text-3xl font-semibold text-[#20221F]">
                {language === 'bs' ? dish.name : dish.nameEn}
              </h2>
              <span className="font-serif text-2xl font-bold text-[#B66F52]">
                {dish.price.toFixed(2)} KM
              </span>
            </div>

            <p className="text-sm text-[#20221F]/80 leading-relaxed font-light">
              {language === 'bs' ? dish.description : dish.descriptionEn}
            </p>
          </div>

          {/* Quick Meta: Prep time, calories, dietary tags */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#59634A] bg-[#F7F4ED] p-3 rounded-xl border border-[#E9E1D4]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#B66F52]" />
              <span>{dish.prepTimeMinutes} min {language === 'bs' ? 'pripreme' : 'prep time'}</span>
            </div>
            {dish.calories && (
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#B66F52]" />
                <span>{dish.calories} kcal</span>
              </div>
            )}
            <div className="flex flex-wrap gap-1">
              {dish.dietaryTags.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-white text-[#20221F] border border-[#E9E1D4] text-[10px] uppercase font-semibold">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Ingredients list */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#59634A] mb-1">
              {language === 'bs' ? 'Sastojci & Porijeklo' : 'Ingredients & Provenance'}
            </h4>
            <p className="text-xs text-[#20221F]/70 leading-relaxed">
              {language === 'bs' ? dish.ingredients : dish.ingredientsEn}
            </p>
          </div>

          {/* Allergen Information & Mandatory Safety Notice */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{language === 'bs' ? 'Informacije o alergenima' : 'Allergen Advisory'}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-900">
              {language === 'bs' ? 'Sadrži ili može sadržavati tragove: ' : 'Contains or may contain traces of: '}
              <strong className="uppercase">
                {dish.allergens.length > 0 ? dish.allergens.join(', ') : (language === 'bs' ? 'nema evidentiranih alergena' : 'no declared allergens')}
              </strong>.
            </p>
            <p className="text-[11px] text-amber-800 italic">
              {language === 'bs'
                ? '*Upozorenje: Molimo goste sa ozbiljnim alergijama na hranu da obavezno obavijeste osoblje prije naručivanja.'
                : '*Advisory note: Guests with severe food allergies should contact the restaurant staff directly prior to ordering.'}
            </p>
          </div>

          {/* Variants Selector (if any) */}
          {dish.variants && dish.variants.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#59634A] mb-2">
                {language === 'bs' ? 'Odaberite opciju / pečenje' : 'Select Variant / Doneness'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dish.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                      selectedVariant?.id === v.id
                        ? 'border-[#B66F52] bg-[#B66F52]/5 text-[#20221F]'
                        : 'border-[#E9E1D4] hover:bg-[#F7F4ED]'
                    }`}
                  >
                    <span>{language === 'bs' ? v.name : v.nameEn}</span>
                    {v.priceDelta > 0 && (
                      <span className="font-semibold text-[#B66F52]">+{v.priceDelta.toFixed(2)} KM</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extras / Toppings Selector (if any) */}
          {dish.extras && dish.extras.length > 0 && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#59634A] mb-2">
                {language === 'bs' ? 'Dodatni prilozi i dodaci' : 'Optional Add-ons & Extras'}
              </label>
              <div className="space-y-2">
                {dish.extras.map((extra) => {
                  const isChecked = selectedExtras.some((e) => e.id === extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => toggleExtra(extra)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        isChecked
                          ? 'border-[#59634A] bg-[#59634A]/5 text-[#20221F]'
                          : 'border-[#E9E1D4] hover:bg-[#F7F4ED]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                          isChecked ? 'bg-[#59634A] border-[#59634A] text-white' : 'border-stone-400'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span>{language === 'bs' ? extra.name : extra.nameEn}</span>
                      </div>
                      <span className="font-semibold text-[#59634A]">+{extra.price.toFixed(2)} KM</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Preparation Instructions */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#59634A] mb-1.5">
              {language === 'bs' ? 'Posebne napomene za kuhinju' : 'Special Kitchen Instructions'}
            </label>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder={language === 'bs' ? 'Npr. sos sa strane, bez bibera...' : 'e.g., dressing on the side, no pepper...'}
              rows={2}
              className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/50"
            />
          </div>

        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 bg-[#F7F4ED] border-t border-[#E9E1D4] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          
          {/* Quantity Controls */}
          <div className="flex items-center border border-[#E9E1D4] bg-white rounded-xl p-1 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="p-2 rounded-lg text-[#20221F] hover:bg-[#F7F4ED] disabled:opacity-40 transition-colors"
              aria-label="Smanji količinu"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-sm font-bold text-[#20221F]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="p-2 rounded-lg text-[#20221F] hover:bg-[#F7F4ED] transition-colors"
              aria-label="Povećaj količinu"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!dish.isAvailable}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#B66F52] hover:bg-[#96533A] disabled:bg-stone-300 text-white text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>
              {dish.isAvailable
                ? `${language === 'bs' ? 'Dodaj u Korpu' : 'Add to Cart'} &bull; ${totalPrice.toFixed(2)} KM`
                : (language === 'bs' ? 'Nije dostupno' : 'Unavailable')}
            </span>
          </button>

        </div>

      </div>
    </div>
  );
};
