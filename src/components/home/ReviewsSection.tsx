import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { INITIAL_REVIEWS } from '../../data/seedData';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { language } = useRestaurant();

  return (
    <section className="py-20 bg-[#F7F4ED] text-[#20221F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-semibold text-[#B66F52] mb-3">
          <Star className="w-3.5 h-3.5 fill-[#B66F52]" />
          <span>{language === 'bs' ? 'Iskustva Gostiju' : 'Guest Impressions'}</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#20221F] mb-4">
          {language === 'bs' ? 'Riječi Naših Posjetilaca' : 'Reflections from Our Tables'}
        </h2>

        <p className="text-xs sm:text-sm text-[#20221F]/70 max-w-xl mx-auto mb-14 font-light">
          {language === 'bs'
            ? 'Transparentne i provjerene recenzije gostiju koji su posjetili naš restoran u Sarajevu.'
            : 'Authentic feedback and impressions from patrons dining with us in Sarajevo.'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {INITIAL_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="p-8 rounded-2xl bg-white border border-[#E9E1D4] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#B66F52] text-[#B66F52]" />
                  ))}
                </div>

                <p className="font-serif italic text-base text-[#20221F] leading-relaxed mb-6 font-light">
                  &ldquo;{language === 'bs' ? review.comment : review.commentEn}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E9E1D4]/60 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-sm text-[#20221F]">{review.author}</h4>
                  <p className="text-[11px] text-[#20221F]/50">{review.date}</p>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#59634A] font-medium bg-[#59634A]/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3 text-[#59634A]" />
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
