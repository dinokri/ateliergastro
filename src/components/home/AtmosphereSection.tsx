import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Wine, Award, HeartHandshake, Compass } from 'lucide-react';

interface AtmosphereSectionProps {
  setCurrentTab: (tab: string) => void;
}

export const AtmosphereSection: React.FC<AtmosphereSectionProps> = ({ setCurrentTab }) => {
  const { language } = useRestaurant();

  return (
    <section className="py-24 bg-[#E9E1D4]/40 border-y border-[#E9E1D4] text-[#20221F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Visual Collages with Editorial Layout */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white max-w-md mx-auto lg:max-w-none">
              <img
                src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=900&auto=format&fit=crop&q=80"
                alt="Atelier Bistro Dining Room Atmosphere"
                width="480"
                height="384"
                loading="lazy"
                decoding="async"
                className="w-full h-96 object-cover object-center"
              />
            </div>

            {/* Overlapping Floating Element */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 z-20 w-64 rounded-xl overflow-hidden shadow-xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&auto=format&fit=crop&q=80"
                alt="Executive Chef Plating Modern Dish"
                width="256"
                height="176"
                loading="lazy"
                decoding="async"
                className="w-full h-44 object-cover"
              />
            </div>

            {/* Subtle Olive Accent Badge */}
            <div className="absolute -top-6 -left-6 z-20 bg-[#59634A] text-[#F7F4ED] p-5 rounded-2xl shadow-xl hidden sm:flex flex-col items-center justify-center text-center">
              <Award className="w-6 h-6 text-[#E9E1D4] mb-1" />
              <span className="font-serif text-lg font-bold">12+ Godina</span>
              <span className="text-[10px] uppercase tracking-wider text-[#E9E1D4]/90">Kulinarske Tradicije</span>
            </div>
          </div>

          {/* Editorial Narrative */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#96472C]">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'bs' ? 'Naša Kulinarska Filozofija' : 'Our Gastronomic Philosophy'}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#20221F] leading-tight">
              {language === 'bs' 
                ? 'Harmonija Mediterana i Savremene Svjetske Gastronomije' 
                : 'Harmony of the Mediterranean and Modern World Cuisine'}
            </h2>

            <p className="text-sm sm:text-base text-[#20221F]/85 font-light leading-relaxed">
              {language === 'bs'
                ? 'Atelier Bistro nastao je iz duboke strasti prema čistim okusima i beskompromisnom kvalitetu namirnica. Svaki tanjir je slikarsko platno na kojem naši šefovi spajaju tradicionalne recepte jadranske obale sa modernim kulinarskim tehnikama sous-vide, fermentacije i drvenog uglja.'
                : 'Atelier Bistro was founded on an unrelenting reverence for unadulterated flavors and pristine provenance. Each plate is a culinary canvas where our chefs combine time-honored Adriatic coastal recipes with modern techniques of wood fire, sous-vide, and natural fermentation.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-[#E9E1D4] shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#59634A]/10 text-[#3F4734] flex items-center justify-center mb-2">
                  <Wine className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#20221F]">
                  {language === 'bs' ? 'Autorska Vinska Karta' : 'Curated Wine Cellar'}
                </h3>
                <p className="text-xs text-[#20221F]/75 mt-1">
                  {language === 'bs' ? 'Preko 120 odabranih organskih i grand cru etiketa.' : 'Over 120 organic and premier cru vintages.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-[#E9E1D4] shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-[#96472C]/10 text-[#96472C] flex items-center justify-center mb-2">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <h3 className="font-serif text-base font-semibold text-[#20221F]">
                  {language === 'bs' ? 'Lokalni Proizvođači' : 'Local Artisans'}
                </h3>
                <p className="text-xs text-[#20221F]/75 mt-1">
                  {language === 'bs' ? 'Hercegovački sirevi, maslinova ulja i organsko povrće.' : 'Karst artisan cheeses, cold-pressed oils, wild herbs.'}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentTab('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#20221F] hover:bg-[#B66F52] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                {language === 'bs' ? 'Upoznajte Naš Tim & Priču' : 'Discover Our Story & Team'}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
