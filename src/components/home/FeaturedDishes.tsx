import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { MenuItem } from '../../types/restaurant';
import { Plus, Sparkles, Flame, ArrowRight, Eye } from 'lucide-react';

interface FeaturedDishesProps {
  setCurrentTab: (tab: string) => void;
}

export const FeaturedDishes: React.FC<FeaturedDishesProps> = ({ setCurrentTab }) => {
  const { language, menuItems, addToCart, setSelectedDish } = useRestaurant();

  // Pick chef recommendations and bestsellers
  const featured = menuItems.filter(
    (item) => item.isChefRecommendation || item.isBestseller
  ).slice(0, 6);

  return (
    <section className="py-20 bg-[#FAF8F5] text-[#121417]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-bold text-[#8E723B] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>{language === 'bs' ? 'Autorski Specijaliteti' : 'Chef’s Recommendations'}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#121417]">
              {language === 'bs' ? 'Preporučena Jela & Bestselleri' : 'Signature Dishes & Highlights'}
            </h2>
          </div>

          <button
            onClick={() => {
              setCurrentTab('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-[#8E723B] hover:text-[#C5A059] transition-colors group"
          >
            <span>{language === 'bs' ? 'Pogledaj kompletan meni (35+ jela)' : 'View entire menu'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((item) => (
            <article
              key={item.id}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8E2D6] shadow-[0_4px_24px_rgba(18,20,23,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-60 w-full overflow-hidden bg-[#EDE7DD]/40">
                  <img
                    src={item.imageUrl}
                    alt={language === 'bs' ? item.name : item.nameEn}
                    width="400"
                    height="240"
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.isChefRecommendation && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#121417]/95 text-[#C5A059] border border-[#C5A059]/40 shadow-xs backdrop-blur-sm">
                        {language === 'bs' ? 'Šef Preporučuje' : 'Chef Choice'}
                      </span>
                    )}
                    {item.isBestseller && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9B412D] text-white shadow-xs">
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-[#121417]/95 backdrop-blur-md text-[#FAF8F5] border border-[#C5A059]/30 px-3 py-1 rounded-xl font-serif text-lg font-bold shadow-md">
                    {item.price.toFixed(2)} <span className="text-xs font-sans text-[#C5A059]">KM</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Dietary tags */}
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {item.dietaryTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#8E723B] font-semibold border border-[#E8E2D6]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-serif text-xl font-semibold text-[#121417] mb-2 group-hover:text-[#C5A059] transition-colors">
                    {language === 'bs' ? item.name : item.nameEn}
                  </h3>

                  <p className="text-xs text-[#121417]/70 line-clamp-2 leading-relaxed mb-4">
                    {language === 'bs' ? item.shortDescription : item.shortDescriptionEn}
                  </p>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 pb-6 pt-3 border-t border-[#E8E2D6]/50 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedDish(item)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#E8E2D6] hover:bg-[#FAF8F5] text-xs font-semibold text-[#121417] flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#8E723B]" />
                  <span>{language === 'bs' ? 'Detalji & Sastojci' : 'Details'}</span>
                </button>

                <button
                  onClick={() => addToCart(item, 1)}
                  disabled={!item.isAvailable}
                  className="py-2.5 px-4 rounded-xl bg-[#121417] hover:bg-[#C5A059] hover:text-[#121417] disabled:bg-stone-300 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  aria-label={`Dodaj ${item.name} u korpu`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{language === 'bs' ? 'Dodaj' : 'Add'}</span>
                </button>
              </div>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
};
