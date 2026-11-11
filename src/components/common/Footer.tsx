import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Instagram, 
  Facebook, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  HeartHandshake 
} from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openLegalModal: (type: 'privacy' | 'cookies' | 'terms' | 'allergens' | 'delivery') => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openLegalModal }) => {
  const { language, settings, subscribeNewsletter } = useRestaurant();
  const [emailInput, setEmailInput] = useState('');
  const [consentChecked, setConsentChecked] = useState(false);
  const [subscribeStatus, setSubscribeStatus] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentChecked) {
      setSubscribeStatus(
        language === 'bs' 
          ? 'Molimo označite saglasnost za primanje obavijesti.' 
          : 'Please check the consent box to proceed.'
      );
      return;
    }
    setIsSubmitting(true);
    const res = await subscribeNewsletter(emailInput);
    setIsSubmitting(false);
    setSubscribeStatus(res.message);
    if (res.success) {
      setEmailInput('');
      setConsentChecked(false);
    }
  };

  return (
    <footer className="bg-[#121417] text-[#FAF8F5] pt-16 pb-24 md:pb-16 border-t border-[#C5A059]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl tracking-widest uppercase font-semibold text-[#FAF8F5]">
              {settings.name}
            </h3>
            <p className="text-xs tracking-[0.2em] text-[#C5A059] uppercase font-bold">
              Sarajevo &bull; Haute Cuisine
            </p>
            <p className="text-sm text-[#FAF8F5]/80 leading-relaxed font-light">
              {language === 'bs' ? settings.tagline : settings.taglineEn}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-[#121417] flex items-center justify-center text-[#FAF8F5] transition-all"
                aria-label="Instagram Atelier Bistro"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#C5A059] hover:text-[#121417] flex items-center justify-center text-[#FAF8F5] transition-all"
                aria-label="Facebook Atelier Bistro"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Hours & Hospitality */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059]">
              {language === 'bs' ? 'Radno Vrijeme' : 'Operating Hours'}
            </h3>
            <div className="space-y-2 text-xs text-[#FAF8F5]/80">
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span>{language === 'bs' ? 'Pon - Čet:' : 'Mon - Thu:'}</span>
                <span className="font-medium text-[#FAF8F5]">08:00 - 23:00</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span>{language === 'bs' ? 'Pet - Sub:' : 'Fri - Sat:'}</span>
                <span className="font-medium text-[#FAF8F5]">08:00 - 00:00</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/10">
                <span>{language === 'bs' ? 'Nedjelja:' : 'Sunday:'}</span>
                <span className="font-medium text-[#FAF8F5]">10:00 - 22:00</span>
              </div>
            </div>
            <p className="text-[11px] text-[#C5A059]/80 italic">
              {language === 'bs' 
                ? '*Kuhinja prima narudžbe do 22:15h (nedjeljom do 21:15h).' 
                : '*Kitchen accepts orders until 22:15h (Sundays until 21:15h).'}
            </p>
          </div>

          {/* Column 3: Location & Direct Contact */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059]">
              {language === 'bs' ? 'Lokacija & Kontakt' : 'Location & Inquiries'}
            </h3>
            <div className="space-y-3 text-xs text-[#FAF8F5]/80">
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(`${settings.address}, ${settings.city}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 hover:text-[#C5A059] transition-colors group"
              >
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5 group-hover:text-white" />
                <span>{settings.address}, {settings.city}, {settings.country}</span>
              </a>

              <a 
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2.5 hover:text-[#C5A059] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{settings.phone}</span>
              </a>

              <a 
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 hover:text-[#C5A059] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>{settings.email}</span>
              </a>
            </div>

            <button
              onClick={() => {
                setCurrentTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-[#C5A059] hover:underline font-semibold flex items-center gap-1 pt-1"
            >
              <span>{language === 'bs' ? 'Pogledaj upute i mapu' : 'Get driving directions'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#C5A059]">
              {language === 'bs' ? 'Gastronomski Bilten' : 'Culinary Gazette'}
            </h3>
            <p className="text-xs text-[#FAF8F5]/80 font-light leading-relaxed">
              {language === 'bs'
                ? 'Prijavite se za sezonske degustacijske menije, gostovanja vinara i pozivnice za privatne večeri.'
                : 'Subscribe for seasonal tasting menu announcements, winemaker dinners, and exclusive reservations.'}
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={language === 'bs' ? 'Vaša email adresa' : 'Your email address'}
                  required
                  className="bg-white/10 text-xs text-[#FAF8F5] placeholder-stone-400 px-3 py-2.5 rounded-xl border border-white/20 focus:outline-none focus:border-[#C5A059] flex-1"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 bg-[#C5A059] hover:bg-[#B38E46] text-[#121417] rounded-xl text-xs font-bold tracking-wider transition-colors disabled:opacity-50"
                  aria-label="Prijavi se na newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Explicit Consent Checkbox */}
              <label className="flex items-start gap-2 text-[11px] text-[#FAF8F5]/70 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded border-white/20 text-[#C5A059] focus:ring-0 bg-white/10"
                />
                <span>
                  {language === 'bs'
                    ? 'Pristajem na primanje obavijesti u skladu sa Politikom privatnosti.'
                    : 'I agree to receive dining updates in accordance with the Privacy Policy.'}
                </span>
              </label>

              {subscribeStatus && (
                <p className="text-xs text-[#C5A059] bg-[#C5A059]/15 p-2 rounded-xl border border-[#C5A059]/30 mt-1">
                  {subscribeStatus}
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Legal & Admin */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/70">
          <p>
            &copy; {new Date().getFullYear()} {settings.name}.{' '}
            {language === 'bs' ? 'Sva prava zadržana.' : 'All rights reserved.'}{' '}
            <span className="text-stone-500">| Sarajevo Fine Dining</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button 
              onClick={() => openLegalModal('privacy')} 
              className="hover:text-white transition-colors"
            >
              {language === 'bs' ? 'Politika Privatnosti' : 'Privacy Policy'}
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('cookies')} 
              className="hover:text-white transition-colors"
            >
              {language === 'bs' ? 'Kolačići' : 'Cookie Policy'}
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('terms')} 
              className="hover:text-white transition-colors"
            >
              {language === 'bs' ? 'Uslovi Korištenja' : 'Terms & Conditions'}
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('allergens')} 
              className="hover:text-white transition-colors"
            >
              {language === 'bs' ? 'Vodič za Alergene' : 'Allergen Information'}
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('delivery')} 
              className="hover:text-white transition-colors"
            >
              {language === 'bs' ? 'Dostava & Otkazivanje' : 'Delivery & Cancellation'}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => {
                setCurrentTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1.5 text-[#C5A059] hover:text-white transition-colors font-bold px-2.5 py-1 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal (dinokrickovic555@gmail.com)</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
