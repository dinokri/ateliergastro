import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink,
  Instagram,
  Facebook
} from 'lucide-react';
import { MapLocationSection } from '../home/MapLocationSection';

export const ContactPage: React.FC = () => {
  const { language, settings } = useRestaurant();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
    }
  };

  const whatsappUrl = `https://wa.me/38733214890?text=${encodeURIComponent(
    language === 'bs' 
      ? 'Pozdrav Atelier Bistro, javljam se sa vaše web stranice u vezi upita.' 
      : 'Hello Atelier Bistro, I am reaching out from your website.'
  )}`;

  return (
    <div className="py-12 bg-[#F7F4ED] text-[#20221F] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B66F52] block mb-2">
            Kontakt &bull; Get in Touch
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#20221F]">
            {language === 'bs' ? 'Stupite u Kontakt sa Nama' : 'Contact Atelier Bistro'}
          </h1>
          <p className="text-xs sm:text-sm text-[#20221F]/70 mt-3 font-light leading-relaxed">
            {language === 'bs'
              ? 'Tu smo za vaša pitanja, posebne kulinarske zahtjeve i sve informacije u vezi posjete našem restoranu.'
              : 'Reach out for table inquiries, custom dining arrangements, and general information.'}
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#59634A]/10 text-[#59634A] flex items-center justify-center mb-4">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#20221F] mb-1">
                {language === 'bs' ? 'Lokacija Restorana' : 'Our Location'}
              </h3>
              <p className="text-xs text-[#20221F]/70 leading-relaxed">
                {settings.address}<br />
                {settings.postalCode} {settings.city}, {settings.country}
              </p>
            </div>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${settings.address}, ${settings.city}`)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 text-xs font-semibold text-[#B66F52] hover:underline flex items-center gap-1"
            >
              <span>{language === 'bs' ? 'Otvori navigaciju' : 'Open in Google Maps'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#B66F52]/10 text-[#B66F52] flex items-center justify-center mb-4">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#20221F] mb-1">
                {language === 'bs' ? 'Telefonski Kontakt' : 'Phone & WhatsApp'}
              </h3>
              <p className="text-xs text-[#20221F]/70 leading-relaxed mb-1">
                {language === 'bs' ? 'Dostupni svakim danom od 08:00 do 23:00h.' : 'Direct telephone line and WhatsApp response.'}
              </p>
              <a
                href={`tel:${settings.phone}`}
                className="font-serif text-lg font-bold text-[#20221F] hover:text-[#B66F52] block"
              >
                {settings.phone}
              </a>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{language === 'bs' ? 'Pošaljite WhatsApp poruku' : 'Chat via WhatsApp'}</span>
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#20221F]/10 text-[#20221F] flex items-center justify-center mb-4">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#20221F] mb-1">
                {language === 'bs' ? 'Email Prepiska' : 'Email Enquiries'}
              </h3>
              <p className="text-xs text-[#20221F]/70 leading-relaxed mb-1">
                {language === 'bs' ? 'Za opšte upite, medije i partnerstva.' : 'General inquiries, media, and partnerships.'}
              </p>
              <a
                href={`mailto:${settings.email}`}
                className="font-serif text-base font-bold text-[#20221F] hover:text-[#B66F52] block"
              >
                {settings.email}
              </a>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="text-stone-400 hover:text-[#B66F52] transition-colors p-1"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="text-stone-400 hover:text-[#B66F52] transition-colors p-1"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Contact Form & Hours Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E1D4] shadow-md">
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#20221F]">
                  {language === 'bs' ? 'Poruka je Uspješno Poslana!' : 'Message Sent Successfully!'}
                </h3>
                <p className="text-xs text-[#20221F]/70 max-w-sm mx-auto">
                  {language === 'bs'
                    ? 'Hvala vam na poruci. Naš tim će vam odgovoriti u najkraćem mogućem roku.'
                    : 'Thank you for reaching out. We will get back to you shortly.'}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-xl bg-[#59634A] text-white text-xs font-semibold"
                >
                  {language === 'bs' ? 'Pošalji novu poruku' : 'Send another message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif text-2xl font-semibold text-[#20221F] mb-2">
                  {language === 'bs' ? 'Direktna Poruka Menadžmentu' : 'Send Direct Message'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">
                      {language === 'bs' ? 'Ime i Prezime *' : 'Your Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Npr. Hana Begić"
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                    />
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
                      placeholder="hana@example.ba"
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Tema poruke' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={language === 'bs' ? 'Npr. Pitanje u vezi vinske karte' : 'Subject line'}
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Vaša Poruka *' : 'Your Message *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={language === 'bs' ? 'Upišite vašu poruku ovdje...' : 'Write your inquiry here...'}
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#B66F52] hover:bg-[#96533A] text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{language === 'bs' ? 'Pošalji Poruku' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 bg-white p-8 sm:p-10 rounded-3xl border border-[#E9E1D4] shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-[#59634A] mb-2">
                <Clock className="w-4 h-4 text-[#B66F52]" />
                <span>{language === 'bs' ? 'Sedmični Raspored' : 'Opening Hours'}</span>
              </div>
              <h3 className="font-serif text-2xl font-semibold text-[#20221F] mb-6">
                {language === 'bs' ? 'Radno Vrijeme Restorana' : 'Weekly Schedule'}
              </h3>

              <div className="space-y-2.5 text-xs">
                {settings.openingHours.map((h) => (
                  <div key={h.day} className="flex justify-between py-1.5 border-b border-[#E9E1D4]/50">
                    <span className="font-medium text-[#20221F]">{language === 'bs' ? h.day : h.dayEn}</span>
                    <span className="font-semibold text-[#59634A]">
                      {h.isClosed ? (language === 'bs' ? 'Zatvoreno' : 'Closed') : `${h.open} - ${h.close}h`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-[#E9E1D4] text-xs text-[#20221F]/70 space-y-1">
              <p className="font-semibold text-[#20221F]">
                {language === 'bs' ? 'Napomena za rezervacije:' : 'Reservation note:'}
              </p>
              <p className="font-light">
                {language === 'bs'
                  ? 'Za vikend večere preporučujemo rezervaciju minimum 48 sati unaprijed.'
                  : 'Weekend dining requires advance booking of at least 48 hours.'}
              </p>
            </div>
          </div>

        </div>

        {/* Map Section */}
        <MapLocationSection />

      </div>
    </div>
  );
};
