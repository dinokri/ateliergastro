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
    <footer className="bg-[#20221F] text-[#F7F4ED] pt-16 pb-24 md:pb-16 border-t border-[#3F4734]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-[#3F4734]/60">
          
          {/* Column 1: Brand & Philosophy */}
          <div className="space-y-4">
            <h3 className="font-serif text-2xl tracking-widest uppercase font-semibold text-[#F7F4ED]">
              {settings.name}
            </h3>
            <p className="text-xs tracking-[0.2em] text-[#B66F52] uppercase font-medium">
              Sarajevo &bull; Haute Cuisine
            </p>
            <p className="text-sm text-[#E9E1D4]/80 leading-relaxed font-light">
              {language === 'bs' ? settings.tagline : settings.taglineEn}
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#3F4734]/50 hover:bg-[#B66F52] flex items-center justify-center text-[#F7F4ED] transition-colors"
                aria-label="Instagram Atelier Bistro"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#3F4734]/50 hover:bg-[#B66F52] flex items-center justify-center text-[#F7F4ED] transition-colors"
                aria-label="Facebook Atelier Bistro"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Hours & Hospitality */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B66F52]">
              {language === 'bs' ? 'Radno Vrijeme' : 'Operating Hours'}
            </h4>
            <div className="space-y-2 text-xs text-[#E9E1D4]/80">
              <div className="flex justify-between py-1 border-b border-[#3F4734]/40">
                <span>{language === 'bs' ? 'Pon - Čet:' : 'Mon - Thu:'}</span>
                <span className="font-medium text-[#F7F4ED]">08:00 - 23:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3F4734]/40">
                <span>{language === 'bs' ? 'Pet - Sub:' : 'Fri - Sat:'}</span>
                <span className="font-medium text-[#F7F4ED]">08:00 - 00:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#3F4734]/40">
                <span>{language === 'bs' ? 'Nedjelja:' : 'Sunday:'}</span>
                <span className="font-medium text-[#F7F4ED]">10:00 - 22:00</span>
              </div>
            </div>
            <p className="text-[11px] text-[#E9E1D4]/60 italic">
              {language === 'bs' 
                ? '*Kuhinja prima narudžbe do 22:15h (nedjeljom do 21:15h).' 
                : '*Kitchen accepts orders until 22:15h (Sundays until 21:15h).'}
            </p>
          </div>

          {/* Column 3: Location & Direct Contact */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B66F52]">
              {language === 'bs' ? 'Lokacija & Kontakt' : 'Location & Inquiries'}
            </h4>
            <div className="space-y-3 text-xs text-[#E9E1D4]/80">
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(`${settings.address}, ${settings.city}`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2.5 hover:text-[#B66F52] transition-colors group"
              >
                <MapPin className="w-4 h-4 text-[#59634A] shrink-0 mt-0.5 group-hover:text-[#B66F52]" />
                <span>{settings.address}, {settings.city}, {settings.country}</span>
              </a>

              <a 
                href={`tel:${settings.phone}`}
                className="flex items-center gap-2.5 hover:text-[#B66F52] transition-colors"
              >
                <Phone className="w-4 h-4 text-[#59634A] shrink-0" />
                <span>{settings.phone}</span>
              </a>

              <a 
                href={`mailto:${settings.email}`}
                className="flex items-center gap-2.5 hover:text-[#B66F52] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#59634A] shrink-0" />
                <span>{settings.email}</span>
              </a>
            </div>

            <button
              onClick={() => {
                setCurrentTab('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs text-[#B66F52] hover:underline font-medium flex items-center gap-1 pt-1"
            >
              <span>{language === 'bs' ? 'Pogledaj upute i mapu' : 'Get driving directions'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Column 4: Newsletter Subscription */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B66F52]">
              {language === 'bs' ? 'Gastronomski Bilten' : 'Culinary Gazette'}
            </h4>
            <p className="text-xs text-[#E9E1D4]/80 font-light leading-relaxed">
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
                  className="bg-[#2D302B] text-xs text-[#F7F4ED] placeholder-[#E9E1D4]/40 px-3 py-2.5 rounded-lg border border-[#3F4734] focus:outline-none focus:border-[#B66F52] flex-1"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-3.5 py-2.5 bg-[#59634A] hover:bg-[#B66F52] text-white rounded-lg text-xs font-semibold tracking-wider transition-colors disabled:opacity-50"
                  aria-label="Prijavi se na newsletter"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Explicit Consent Checkbox */}
              <label className="flex items-start gap-2 text-[11px] text-[#E9E1D4]/70 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-0.5 rounded border-[#3F4734] text-[#B66F52] focus:ring-0 bg-[#2D302B]"
                />
                <span>
                  {language === 'bs'
                    ? 'Pristajem na primanje obavijesti u skladu sa Politikom privatnosti.'
                    : 'I agree to receive dining updates in accordance with the Privacy Policy.'}
                </span>
              </label>

              {subscribeStatus && (
                <p className="text-xs text-[#E9E1D4] bg-[#3F4734]/40 p-2 rounded border border-[#3F4734] mt-1">
                  {subscribeStatus}
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Bottom Bar: Legal & Admin */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#E9E1D4]/60">
          <p>
            &copy; {new Date().getFullYear()} {settings.name}.{' '}
            {language === 'bs' ? 'Sva prava zadržana.' : 'All rights reserved.'}{' '}
            <span className="text-[#E9E1D4]/40">| Demo Platform</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button 
              onClick={() => openLegalModal('privacy')} 
              className="hover:text-[#F7F4ED] transition-colors"
            >
              {language === 'bs' ? 'Politika Privatnosti' : 'Privacy Policy'}
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('cookies')} 
              className="hover:text-[#F7F4ED] transition-colors"
            >
              {language === 'bs' ? 'Kolačići' : 'Cookie Policy'}
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('terms')} 
              className="hover:text-[#F7F4ED] transition-colors"
            >
              {language === 'bs' ? 'Uslovi Korištenja' : 'Terms & Conditions'}
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('allergens')} 
              className="hover:text-[#F7F4ED] transition-colors"
            >
              {language === 'bs' ? 'Vodič za Alergene' : 'Allergen Information'}
            </button>
            <span>&bull;</span>
            <button 
              onClick={() => openLegalModal('delivery')} 
              className="hover:text-[#F7F4ED] transition-colors"
            >
              {language === 'bs' ? 'Dostava & Otkazivanje' : 'Delivery & Cancellation'}
            </button>
            <span>&bull;</span>
            <button
              onClick={() => {
                setCurrentTab('admin');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-[#B66F52] hover:text-[#F7F4ED] transition-colors font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
