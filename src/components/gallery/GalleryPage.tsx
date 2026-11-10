import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string;
  category: 'food' | 'interior' | 'drinks' | 'kitchen' | 'events';
  titleBs: string;
  titleEn: string;
  imageUrl: string;
}

export const GalleryPage: React.FC = () => {
  const { language } = useRestaurant();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      id: 'g1',
      category: 'interior',
      titleBs: 'Glavni Salon sa Kaminom',
      titleEn: 'Main Salon & Fireplace Lounge',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'g2',
      category: 'food',
      titleBs: 'Odležali Dry-Aged Ribeye Odrezak',
      titleEn: 'Dry-Aged Prime Ribeye Steak',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'g3',
      category: 'drinks',
      titleBs: 'Atelier Signature Bergamot Spritz',
      titleEn: 'Atelier Signature Bergamot Spritz',
      imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'g4',
      category: 'kitchen',
      titleBs: 'Kulinarska Brigada u Akciji',
      titleEn: 'Open Kitchen Brigade in Motion',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'g5',
      category: 'food',
      titleBs: 'Ručno Rađeni Tagliolini sa Tartufima',
      titleEn: 'Handmade Tagliolini with Shaved Truffles',
      imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'g6',
      category: 'interior',
      titleBs: 'Maslinova Terasa uz Rijeku',
      titleEn: 'Olive Terrace Riverbank Ambience',
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'g7',
      category: 'drinks',
      titleBs: 'Privatna Vinska Enoteka',
      titleEn: 'Private Reserve Wine Cellar',
      imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'g8',
      category: 'events',
      titleBs: 'Privatna Gala Večera',
      titleEn: 'Private Gala Wine Dinner',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80',
    },
    {
      id: 'g9',
      category: 'food',
      titleBs: 'Karamelizovani Odrezak od Karfiola',
      titleEn: 'Spiced Roasted Cauliflower Steak',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&auto=format&fit=crop&q=80',
    },
  ];

  const filtered = activeCategory === 'all'
    ? galleryItems
    : galleryItems.filter((i) => i.category === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((idx) => (idx !== null ? (idx + 1) % filtered.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((idx) => (idx !== null ? (idx - 1 + filtered.length) % filtered.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filtered.length]);

  return (
    <div className="py-12 bg-[#F7F4ED] text-[#20221F] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B66F52] block mb-2">
            Vizuelni Doživljaj &bull; Photo Archive
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#20221F]">
            {language === 'bs' ? 'Galerija Restorana' : 'Visual Gallery'}
          </h1>
          <p className="text-xs sm:text-sm text-[#20221F]/70 mt-3 font-light leading-relaxed">
            {language === 'bs'
              ? 'Zavirite u ambijent, kulinarske kreacije, vinsku kartu i atmosferu naših večeri.'
              : 'Immerse in the atmosphere, culinary presentations, cellar, and guest experiences.'}
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {[
            { id: 'all', bs: 'Sve Fotografije', en: 'All Photos' },
            { id: 'food', bs: 'Hrana & Specijaliteti', en: 'Cuisine' },
            { id: 'interior', bs: 'Ambijent & Salon', en: 'Interior' },
            { id: 'drinks', bs: 'Vina & Kokteli', en: 'Cocktails & Wine' },
            { id: 'kitchen', bs: 'Otvorena Kuhinja', en: 'Kitchen Brigade' },
            { id: 'events', bs: 'Događaji', en: 'Private Events' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                activeCategory === cat.id
                  ? 'bg-[#20221F] text-white shadow-sm'
                  : 'bg-white text-[#20221F]/70 border border-[#E9E1D4] hover:bg-[#E9E1D4]'
              }`}
            >
              {language === 'bs' ? cat.bs : cat.en}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border border-[#E9E1D4] bg-[#E9E1D4]/40"
            >
              <img
                src={item.imageUrl}
                alt={language === 'bs' ? item.titleBs : item.titleEn}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#20221F]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#B66F52] font-bold block mb-1">
                    {item.category.toUpperCase()}
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-[#F7F4ED]">
                    {language === 'bs' ? item.titleBs : item.titleEn}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filtered[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Zatvori galeriju"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLightboxIndex((idx) => (idx !== null ? (idx - 1 + filtered.length) % filtered.length : null))}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Prethodna fotografija"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setLightboxIndex((idx) => (idx !== null ? (idx + 1) % filtered.length : null))}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Sljedeća fotografija"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={filtered[lightboxIndex].imageUrl}
              alt={filtered[lightboxIndex].titleBs}
              className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
            />
            <p className="text-white font-serif text-lg mt-4 text-center">
              {language === 'bs' ? filtered[lightboxIndex].titleBs : filtered[lightboxIndex].titleEn}
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
