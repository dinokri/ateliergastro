import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, Shield, FileText, Cookie, AlertTriangle, Truck } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'cookies' | 'terms' | 'allergens' | 'delivery' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  const { language, settings } = useRestaurant();

  if (!type) return null;

  const contentMap: Record<string, { titleBs: string; titleEn: string; icon: any; bodyBs: React.ReactNode; bodyEn: React.ReactNode }> = {
    privacy: {
      titleBs: 'Politika Privatnosti & Zaštita Podataka',
      titleEn: 'Privacy Policy & Data Protection',
      icon: Shield,
      bodyBs: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <p>
            Atelier Bistro Sarajevo poštuje privatnost svih svojih gostiju i posjetilaca. Ovi podaci se prikupljaju isključivo u svrhu obrade vaših narudžbi hrane, rezervacija stolova i slanja newsletter obavijesti ukoliko ste dali izričiti pristanak.
          </p>
          <h4 className="font-bold text-[#20221F] text-sm">1. Koje podatke prikupljamo?</h4>
          <p>
            Prilikom naručivanja hrane i rezervacija prikupljamo ime i prezime, broj telefona, email adresu i adresu za dostavu. Ovi podaci se čuvaju na sigurnim serverima i nikada se ne prosljeđuju trećim stranama.
          </p>
          <h4 className="font-bold text-[#20221F] text-sm">2. Prava korisnika</h4>
          <p>
            Svaki korisnik ima pravo zatražiti uvid, ispravku ili brisanje svojih ličnih podataka u bilo kojem trenutku slanjem zahtjeva na <a href={`mailto:${settings.email}`} className="text-[#B66F52] underline">{settings.email}</a>.
          </p>
          <div className="p-3 bg-stone-100 rounded-xl text-stone-600 italic">
            *Napomena: Ova demonstraciona platforma služi za testiranje i naručivanje hrane za Atelier Bistro Sarajevo.
          </div>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <p>
            Atelier Bistro values your privacy. We collect personal data strictly to fulfill table reservations, process food orders, and deliver dining updates with your consent.
          </p>
          <h4 className="font-bold text-[#20221F] text-sm">1. Information Collected</h4>
          <p>
            Customer name, telephone number, email address, and delivery destination coordinates are captured securely and never sold or disseminated to marketing brokers.
          </p>
          <h4 className="font-bold text-[#20221F] text-sm">2. Your Rights</h4>
          <p>
            You retain the unconditional right to access, rectify, or purge your records upon request to <a href={`mailto:${settings.email}`} className="text-[#B66F52] underline">{settings.email}</a>.
          </p>
        </div>
      ),
    },
    cookies: {
      titleBs: 'Politika Kolačića (Cookie Policy)',
      titleEn: 'Cookie Policy',
      icon: Cookie,
      bodyBs: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <p>
            Naša web platforma koristi neophodne funkcionalne kolačiće (tehničke sesije i spremanje vaše korpe u lokalnoj memoriji) kako bi vam omogućila nesmetano naručivanje i pregled menija.
          </p>
          <h4 className="font-bold text-[#20221F] text-sm">Neophodni kolačići:</h4>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>atelier_cart:</strong> Čuva odabrana jela u vašoj korpi tokom navigacije.</li>
            <li><strong>atelier_settings:</strong> Pamti jezičke postavke (Bosanski / Engleski).</li>
          </ul>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <p>
            Our web platform uses necessary functional cookies and local session storage to retain your cart items and language selection between pages.
          </p>
        </div>
      ),
    },
    terms: {
      titleBs: 'Opšti Uslovi Korištenja',
      titleEn: 'Terms & Conditions',
      icon: FileText,
      bodyBs: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <p>
            Korištenjem web stranice Atelier Bistro Sarajevo prihvatate ove Uslove korištenja. Sve cijene na stranici su iskazane u konvertibilnim markama (BAM / KM) sa uračunatim porezom na dodatu vrijednost (PDV).
          </p>
          <h4 className="font-bold text-[#20221F] text-sm">Rezervacije i kašnjenje</h4>
          <p>
            Molimo goste da u slučaju kašnjenja dužeg od 15 minuta obavijeste osoblje telefonskim putem. Restoran zadržava pravo otkazivanja rezervacije ukoliko se gosti ne jave unutar 20 minuta od zakazanog termina.
          </p>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <p>
            By using Atelier Bistro, you agree to these operational terms. All prices are listed in Convertible Marks (BAM / KM) inclusive of value-added tax (PDV).
          </p>
        </div>
      ),
    },
    allergens: {
      titleBs: 'Vodič i Izjava o Alergenima',
      titleEn: 'Allergen Guidance & Transparency',
      icon: AlertTriangle,
      bodyBs: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-semibold">
            Obavijest za goste sa težim alergijama: Naša kuhinja priprema jela koja mogu sadržavati gluten, orašaste plodove, mliječne proizvode, ribu i rakove. Molimo obavezno obavijestite konobara prije narudžbe.
          </div>
          <p>
            U skladu sa standardima sigurnosti hrane, svaki artikal na našem digitalnom meniju ima jasno označene potencijalne alergene i sastojke.
          </p>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-semibold">
            Severe allergy notice: Our brigade operates an open kitchen handling gluten, shellfish, dairy, tree nuts, and eggs. Always alert your server prior to dining.
          </div>
        </div>
      ),
    },
    delivery: {
      titleBs: 'Politika Dostave & Otkazivanja',
      titleEn: 'Delivery, Return & Cancellation Policy',
      icon: Truck,
      bodyBs: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <p>
            Dostavu vršimo na području grada Sarajeva u zonama: Stari Grad, Centar, Novo Sarajevo, Novi Grad i Ilidža.
          </p>
          <h4 className="font-bold text-[#20221F] text-sm">Vrijeme dostave</h4>
          <p>
            Standardno vrijeme dostave iznosi između 35 i 50 minuta u zavisnosti od saobraćaja i obima narudžbi u kuhinji.
          </p>
          <h4 className="font-bold text-[#20221F] text-sm">Otkazivanje narudžbe</h4>
          <p>
            Narudžba se može otkazati unutar 5 minuta od trenutka slanja prije nego što kuhinja započne termičku obradu jela.
          </p>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs text-[#20221F]/80 leading-relaxed">
          <p>
            We deliver across the greater Sarajevo metropolitan zones. Estimated preparation and transit time is 35-50 minutes. Orders may be amended or cancelled within 5 minutes of placement before cooking begins.
          </p>
        </div>
      ),
    },
  };

  const current = contentMap[type];
  if (!current) return null;
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white text-[#20221F] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#E9E1D4] flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6 bg-[#F7F4ED] border-b border-[#E9E1D4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#59634A] text-white rounded-xl shadow-sm">
              <Icon className="w-5 h-5" />
            </div>
            <h2 className="font-serif text-xl font-semibold text-[#20221F]">
              {language === 'bs' ? current.titleBs : current.titleEn}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-[#20221F] hover:bg-[#E9E1D4] transition-colors"
            aria-label="Zatvori prozor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {language === 'bs' ? current.bodyBs : current.bodyEn}
        </div>

        <div className="p-4 bg-[#F7F4ED] border-t border-[#E9E1D4] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#20221F] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B66F52] transition-colors"
          >
            {language === 'bs' ? 'Zatvori' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
