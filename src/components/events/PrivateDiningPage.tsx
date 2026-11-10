import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Users, Calendar, Sparkles, CheckCircle2, AlertCircle, Phone, Mail, GlassWater } from 'lucide-react';

export const PrivateDiningPage: React.FC = () => {
  const { language, settings, submitEventInquiry } = useRestaurant();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [eventType, setEventType] = useState<'corporate' | 'private_dining' | 'birthday' | 'wedding' | 'catering'>('private_dining');
  const [preferredDate, setPreferredDate] = useState('');
  const [guestsCount, setGuestsCount] = useState(15);
  const [additionalRequests, setAdditionalRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const spaces = [
    {
      titleBs: 'Enoteka Vinski Podrum',
      titleEn: 'Private Wine Vault',
      capacity: 'Do 22 sjedeća mjesta',
      capacityEn: 'Up to 22 seated guests',
      descBs: 'Savršen za intimne poslovne večere, degustacije rijetkih vina i privatna slavlja sa posvećenim sommelierom.',
      descEn: 'Tailored for executive board dinners and private tastings with an assigned sommelier.',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&auto=format&fit=crop&q=80',
    },
    {
      titleBs: 'Glavni Salon "Atelier"',
      titleEn: 'Main Dining Salon',
      capacity: 'Do 65 sjedećih mjesta',
      capacityEn: 'Up to 65 seated guests',
      descBs: 'Raskošan prostor sa kaminom, visokim stropovima i fleksibilnim rasporedom za korporativne gala događaje i vjenčanja.',
      descEn: 'Expansive salon with fireplace, high ceilings, and custom configurations for corporate galas and weddings.',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    },
    {
      titleBs: 'Zimska & Ljetna Maslinova Terasa',
      titleEn: 'Covered Olive Terrace',
      capacity: 'Do 45 sjedećih mjesta',
      capacityEn: 'Up to 45 seated guests',
      descBs: 'Klimatizovana terasa uz obalu Miljacke sa prirodnim zelenilom i panoramskim pogledom na starogradske mostove.',
      descEn: 'Heated riverbank terrace framed with lush Mediterranean greenery and historic bridge views.',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !preferredDate) {
      setErrorMsg(language === 'bs' ? 'Molimo popunite sva obavezna polja.' : 'Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEventInquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        eventType,
        preferredDate,
        guestsCount,
        additionalRequests: additionalRequests.trim() || undefined,
      });

      setIsSubmitting(false);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setIsSubmitting(false);
      setErrorMsg(language === 'bs' ? 'Greška pri slanju upita. Pokušajte ponovo.' : 'Failed to submit inquiry.');
    }
  };

  return (
    <div className="py-12 bg-[#F7F4ED] text-[#20221F] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B66F52] block mb-2">
            Privatni Događaji &bull; Banqueting & Catering
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#20221F]">
            {language === 'bs' ? 'Privatna Slavlja & Korporativni Događaji' : 'Private Dining & Group Events'}
          </h1>
          <p className="text-xs sm:text-sm text-[#20221F]/70 mt-4 font-light leading-relaxed">
            {language === 'bs'
              ? 'Od rođendanskih proslava i intimnih vjenčanja do diplomatskih i korporativnih večera — naš tim kreira personalizovane menije prilagođene vašim željama.'
              : 'From corporate celebrations and wedding banquets to bespoke catering — our brigade crafts custom menus for unforgettable gatherings.'}
          </p>
        </div>

        {/* Available Spaces Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {spaces.map((space) => (
            <div
              key={space.titleBs}
              className="bg-white rounded-3xl overflow-hidden border border-[#E9E1D4] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-56 w-full overflow-hidden bg-[#E9E1D4]/40">
                  <img
                    src={space.image}
                    alt={space.titleBs}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B66F52] block mb-1">
                    {language === 'bs' ? space.capacity : space.capacityEn}
                  </span>
                  <h3 className="font-serif text-xl font-semibold text-[#20221F] mb-2">
                    {language === 'bs' ? space.titleBs : space.titleEn}
                  </h3>
                  <p className="text-xs text-[#20221F]/70 font-light leading-relaxed">
                    {language === 'bs' ? space.descBs : space.descEn}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Inquiry Form */}
        <div className="max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-3xl border border-[#E9E1D4] shadow-md">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl font-bold text-[#20221F]">
                {language === 'bs' ? 'Upit Uspješno Poslan!' : 'Inquiry Received!'}
              </h3>
              <p className="text-xs text-[#20221F]/70 max-w-md mx-auto leading-relaxed">
                {language === 'bs'
                  ? 'Zahvaljujemo se na interesovanju. Naš event menadžer će vas kontaktirati unutar 24 sata sa personalizovanom ponudom i prijedlogom menija.'
                  : 'Thank you for reaching out. Our event manager will review your preferences and contact you within 24 hours.'}
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-[#59634A] text-white text-xs font-semibold uppercase tracking-wider"
              >
                {language === 'bs' ? 'Pošalji još jedan upit' : 'Send another inquiry'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#20221F] mb-1">
                  {language === 'bs' ? 'Pošaljite Upit za Događaj ili Catering' : 'Submit Event / Catering Inquiry'}
                </h2>
                <p className="text-xs text-[#20221F]/60">
                  {language === 'bs' ? 'Popunite formular i pripremite vaš događaj bez stresa.' : 'Fill out details to receive a customized quote.'}
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Ime i Prezime / Kompanija *' : 'Name / Company *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Npr. Dino Krickovic"
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Tip Događaja *' : 'Event Type *'}
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-white font-medium"
                  >
                    <option value="private_dining">{language === 'bs' ? 'Privatna večera / Enoteka' : 'Private Dining Room'}</option>
                    <option value="corporate">{language === 'bs' ? 'Korporativni prijem / Banket' : 'Corporate Reception'}</option>
                    <option value="birthday">{language === 'bs' ? 'Rođendan / Godišnjica' : 'Birthday / Anniversary'}</option>
                    <option value="wedding">{language === 'bs' ? 'Vjenčanje' : 'Wedding Banquet'}</option>
                    <option value="catering">{language === 'bs' ? 'Vanjski catering na vašoj lokaciji' : 'Off-site Catering'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Email Adresa *' : 'Email Address *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="kontakt@primjer.ba"
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Broj Telefona *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+387 61 000 000"
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Željeni Datum *' : 'Target Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/40 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Očekivani Broj Gostiju *' : 'Expected Guests *'}
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={200}
                    required
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/40 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20221F] mb-1">
                  {language === 'bs' ? 'Dodatni zahtjevi (specijalni meni, vinska karta, dekoracija)' : 'Special Requirements'}
                </label>
                <textarea
                  rows={3}
                  value={additionalRequests}
                  onChange={(e) => setAdditionalRequests(e.target.value)}
                  placeholder={language === 'bs' ? 'Navedite vaše želje i posebne zahtjeve...' : 'Describe any specific dining or technical needs...'}
                  className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/40"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#B66F52] hover:bg-[#96533A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md disabled:opacity-50"
              >
                {isSubmitting ? 'Slanje...' : (language === 'bs' ? 'Pošalji Upit za Ponudu' : 'Send Inquiry Request')}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
