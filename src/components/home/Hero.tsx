import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Calendar, UtensilsCrossed, ShoppingBag, Clock, Sparkles, ChevronDown } from 'lucide-react';

interface HeroProps {
  setCurrentTab: (tab: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ setCurrentTab }) => {
  const { language, settings } = useRestaurant();

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center bg-[#20221F] text-[#F7F4ED] overflow-hidden">
      {/* Editorial High-Resolution Background Imagery */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop&q=80"
          srcSet="https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=640&auto=format&fit=crop&q=75 640w, https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1080&auto=format&fit=crop&q=80 1080w, https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1920&auto=format&fit=crop&q=85 1920w"
          sizes="100vw"
          width="1920"
          height="1080"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          alt="Atelier Bistro Restaurant Atmosphere and Fine Table Setting"
          className="w-full h-full object-cover object-center scale-105 animate-in fade-in zoom-in-95 duration-1000 opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#20221F] via-[#20221F]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#20221F]/80 via-transparent to-[#20221F]/80" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        
        {/* Subtle Overline Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#59634A]/40 border border-[#59634A]/60 backdrop-blur-md mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#B66F52]" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#E9E1D4]">
            {language === 'bs' ? 'Savremena Mediteranska Gastronomija' : 'Contemporary Mediterranean Dining'}
          </span>
        </div>

        {/* Brand Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal tracking-tight text-[#F7F4ED] leading-[1.08] mb-6 uppercase">
          {settings.name}
        </h1>

        {/* Tagline */}
        <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-[#E9E1D4] max-w-2xl font-light mb-4">
          &ldquo;{language === 'bs' ? settings.tagline : settings.taglineEn}&rdquo;
        </p>

        {/* Short Description */}
        <p className="text-sm sm:text-base text-[#E9E1D4]/80 max-w-xl font-light leading-relaxed mb-10">
          {language === 'bs'
            ? 'Smješten na obali Miljacke, Atelier Bistro donosi spoj jadranskog ulova, ručno rađene tjestenine i najfinijih odležalih odrezaka u ambijentu bezvremenske elegancije.'
            : 'Nestled along the Miljacka riverbank, Atelier Bistro unites fresh Adriatic seafood, handmade pastas, and prime dry-aged cuts within an ambiance of timeless editorial warmth.'}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Primary CTA */}
          <button
            onClick={() => {
              setCurrentTab('reservations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#B66F52] hover:bg-[#96533A] text-white text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
          >
            <Calendar className="w-4 h-4" />
            <span>{language === 'bs' ? 'Rezerviši Sto' : 'Reserve a Table'}</span>
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() => {
              setCurrentTab('menu');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#F7F4ED] hover:bg-[#E9E1D4] text-[#20221F] text-xs sm:text-sm font-semibold tracking-widest uppercase transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2.5"
          >
            <UtensilsCrossed className="w-4 h-4 text-[#59634A]" />
            <span>{language === 'bs' ? 'Istraži Meni' : 'Explore Menu'}</span>
          </button>

          {/* Tertiary CTA: Order Online */}
          <button
            onClick={() => {
              setCurrentTab('order');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-[#3F4734]/80 hover:bg-[#59634A] text-[#F7F4ED] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all border border-[#59634A]/40 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-[#B66F52]" />
            <span>{language === 'bs' ? 'Naruči Online' : 'Order Online'}</span>
          </button>
        </div>

        {/* Key Features Banner */}
        <div className="mt-14 pt-8 border-t border-[#E9E1D4]/15 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs text-[#E9E1D4]/80">
          <div>
            <span className="block font-serif text-lg text-[#F7F4ED] font-semibold">100% Svježe</span>
            <span className="text-[11px] text-[#E9E1D4]/60">{language === 'bs' ? 'Jadranski ulov & domaće farme' : 'Daily Adriatic catch'}</span>
          </div>
          <div>
            <span className="block font-serif text-lg text-[#F7F4ED] font-semibold">30+ Dana</span>
            <span className="text-[11px] text-[#E9E1D4]/60">{language === 'bs' ? 'Dry-aged goveđi odresci' : 'Dry-aged prime cuts'}</span>
          </div>
          <div>
            <span className="block font-serif text-lg text-[#F7F4ED] font-semibold">120+ Etiketa</span>
            <span className="text-[11px] text-[#E9E1D4]/60">{language === 'bs' ? 'Vina regije i svijeta' : 'Selected international vintages'}</span>
          </div>
          <div>
            <span className="block font-serif text-lg text-[#F7F4ED] font-semibold">4.9 &bull; ★★★★★</span>
            <span className="text-[11px] text-[#E9E1D4]/60">{language === 'bs' ? 'Gastro Guide Sarajevo' : 'Verified Dining Reviews'}</span>
          </div>
        </div>

      </div>
    </section>
  );
};
