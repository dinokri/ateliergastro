import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { INITIAL_REVIEWS } from '../../data/seedData';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { language } = useRestaurant();

  return (
    <section className="py-20 bg-[#FAF8F5] text-[#121417]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-bold text-[#8E723B] mb-3">
          <Star className="w-3.5 h-3.5 fill-[#C5A059] text-[#C5A059]" />
          <span>{language === 'bs' ? 'Iskustva Gostiju' : 'Guest Impressions'}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#121417] mb-4">
          {language === 'bs' ? 'Riječi Naših Posjetilaca' : 'Reflections from Our Tables'}
        </h2>

        <p className="text-xs sm:text-sm text-[#121417]/80 max-w-xl mx-auto mb-14 font-light">
          {language === 'bs'
            ? 'Transparentne i provjerene recenzije gostiju koji su posjetili naš restoran u Sarajevu.'
            : 'Authentic feedback and impressions from patrons dining with us in Sarajevo.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {INITIAL_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-8 rounded-3xl bg-white border border-[#E8E2D6] shadow-[0_4px_24px_rgba(18,20,23,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C5A059] text-[#C5A059]" />
                  ))}
                </div>

                <p className="font-serif italic text-base text-[#121417] leading-relaxed mb-6 font-light">
                  &ldquo;{language === 'bs' ? review.comment : review.commentEn}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E8E2D6]/60 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-[#121417]">{review.author}</h3>
                  <p className="text-[11px] text-[#121417]/60">{review.date}</p>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#C5A059] font-medium bg-[#121417] px-2.5 py-1 rounded-full border border-[#C5A059]/30">
                  <CheckCircle2 className="w-3 h-3 text-[#C5A059]" />
                  <span>{review.source}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
