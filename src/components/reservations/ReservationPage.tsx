import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Reservation } from '../../types/restaurant';
import { isWithinOperatingHours } from '../../utils/pricing';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  Wine 
} from 'lucide-react';

export const ReservationPage: React.FC = () => {
  const { language, settings, createReservation } = useRestaurant();

  // Tomorrow as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [date, setDate] = useState(defaultDateStr);
  const [time, setTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState<'indoor_salon' | 'olive_terrace' | 'chef_table' | 'wine_cellar'>('indoor_salon');
  const [occasion, setOccasion] = useState('none');
  const [specialRequests, setSpecialRequests] = useState('');

  // Guest details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Time slot generator
  const availableSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00',
    '20:30', '21:00', '21:30'
  ];

  const seatingAreas = [
    {
      id: 'indoor_salon',
      nameBs: 'Glavni Elegantni Salon',
      nameEn: 'Main Dining Salon',
      descBs: 'Prefinjen ambijent sa mekim osvjetljenjem i pogledom na kamin.',
      descEn: 'Refined ambient with soft lighting and fireplace warmth.',
    },
    {
      id: 'olive_terrace',
      nameBs: 'Maslinova Terasa',
      nameEn: 'Olive Terrace',
      descBs: 'Otvorena ili grijana terasa okružena mediteranskim biljem.',
      descEn: 'Covered heated terrace overlooking the Miljacka riverbank.',
    },
    {
      id: 'wine_cellar',
      nameBs: 'Vinski Podrum (Enoteka)',
      nameEn: 'Historic Wine Cellar',
      descBs: 'Intimna atmosfera među hrastovim bačvama i rijetkim berbama.',
      descEn: 'Intimate candle-lit vault surrounded by reserve vintages.',
    },
    {
      id: 'chef_table',
      nameBs: 'Šefov Sto (Chef’s Table)',
      nameEn: 'Chef’s Table (Open Kitchen)',
      descBs: 'Ekskluzivno sjedenje uz otvorenu kuhinju i prezentaciju šefa.',
      descEn: 'Direct view of the culinary brigade with chef presentations.',
    },
  ];

  const occasionsList = [
    { id: 'none', labelBs: 'Uobičajena večera', labelEn: 'Regular Dining' },
    { id: 'birthday', labelBs: 'Rođendan / Slavlje', labelEn: 'Birthday Celebration' },
    { id: 'business', labelBs: 'Poslovni Ručak / Večera', labelEn: 'Business Meeting' },
    { id: 'anniversary', labelBs: 'Godišnjica / Romantična večera', labelEn: 'Anniversary / Romantic' },
    { id: 'family', labelBs: 'Porodično Okupljanje', labelEn: 'Family Gathering' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMsg(language === 'bs' ? 'Molimo popunite sva kontakt polja.' : 'Please provide all contact details.');
      return;
    }

    // Check operating hours
    const hoursCheck = isWithinOperatingHours(date, time, settings.openingHours);
    if (!hoursCheck.allowed) {
      setErrorMsg(hoursCheck.reason || (language === 'bs' ? 'Restoran je zatvoren u odabrano vrijeme.' : 'Outside operating hours.'));
      return;
    }

    if (guests < 1 || guests > 20) {
      setErrorMsg(language === 'bs' ? 'Za grupe veće od 20 osoba, molimo koristite stranicu za Privatne Događaje.' : 'For groups exceeding 20 guests, please visit Private Dining.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createReservation({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        date,
        time,
        guests,
        seatingArea,
        occasion: occasion !== 'none' ? occasion : undefined,
        specialRequests: specialRequests.trim() || undefined,
      });

      setIsSubmitting(false);
      setConfirmedReservation(res);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(language === 'bs' ? 'Greška prilikom slanja rezervacije. Molimo pozovite restoran.' : 'Failed to submit reservation. Please call the restaurant directly.');
    }
  };

  return (
    <div className="py-12 bg-[#FAF8F5] text-[#121417] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#C5A059] block mb-2">
            Rezervacije Stolova &bull; Atelier Bistro
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#121417]">
            {language === 'bs' ? 'Rezervišite Vaše Kulinarsko Iskustvo' : 'Reserve a Table'}
          </h1>
          <p className="text-xs sm:text-sm text-[#121417]/70 mt-3 font-light leading-relaxed">
            {language === 'bs'
              ? 'Osigurajte svoje mjesto u našem salonu ili na terasi. Sve rezervacije se potvrđuju automatski ili u roku od 15 minuta.'
              : 'Secure your dining table in our salon or terrace. Confirmed instantly with digital reservation voucher.'}
          </p>
        </div>

        {confirmedReservation ? (
          /* Confirmation Success Voucher Card */
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E8E2D6] shadow-xl text-center max-w-xl mx-auto animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#C5A059] mx-auto flex items-center justify-center mb-4 border border-[#E8E2D6]">
              <CheckCircle2 className="w-8 h-8 text-[#C5A059]" />
            </div>

            <span className="text-xs uppercase tracking-widest font-bold text-[#C5A059]">
              {language === 'bs' ? 'Rezervacija Zaprimljena' : 'Reservation Acknowledged'}
            </span>
            <h2 className="font-serif text-3xl font-bold text-[#121417] mt-1 mb-2 font-mono">
              #{confirmedReservation.reservationNumber}
            </h2>

            <p className="text-xs text-[#121417]/70 mb-6 leading-relaxed">
              {language === 'bs'
                ? `Hvala vam, ${confirmedReservation.customerName}. Vaš zahtjev za rezervaciju za ${confirmedReservation.guests} osobe na dan ${confirmedReservation.date} u ${confirmedReservation.time}h je uspješno zabilježen.`
                : `Thank you, ${confirmedReservation.customerName}. Your reservation request for ${confirmedReservation.guests} guests on ${confirmedReservation.date} at ${confirmedReservation.time} has been registered.`}
            </p>

            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E8E2D6] text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-[#121417]/60">{language === 'bs' ? 'Datum i vrijeme:' : 'Date & Time:'}</span>
                <span className="font-bold text-[#121417]">{confirmedReservation.date} u {confirmedReservation.time}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#121417]/60">{language === 'bs' ? 'Broj gostiju:' : 'Party size:'}</span>
                <span className="font-bold text-[#121417]">{confirmedReservation.guests} {language === 'bs' ? 'osoba' : 'guests'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#121417]/60">{language === 'bs' ? 'Zona sjedenja:' : 'Seating area:'}</span>
                <span className="font-bold text-[#121417] capitalize">{confirmedReservation.seatingArea.replace(/_/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#121417]/60">{language === 'bs' ? 'Status:' : 'Status:'}</span>
                <span className="font-bold text-[#C5A059] uppercase">{confirmedReservation.status}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setConfirmedReservation(null)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#121417] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#121417] transition-colors"
              >
                {language === 'bs' ? 'Nova Rezervacija' : 'New Reservation'}
              </button>
              <a
                href={`tel:${settings.phone}`}
                className="py-3 px-4 rounded-xl border border-[#E8E2D6] hover:bg-[#FAF8F5] text-xs font-semibold text-[#121417] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-4 h-4 text-[#C5A059]" />
                <span>{language === 'bs' ? 'Pozovite Restoran' : 'Call Bistro'}</span>
              </a>
            </div>

          </div>
        ) : (
          /* Reservation Form */
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E8E2D6] shadow-md space-y-8">
            
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Step 1: Date, Time & Guests */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#121417] mb-4 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-[#C5A059]" />
                <span>{language === 'bs' ? '1. Datum, Vrijeme i Broj Gostiju' : '1. Date, Time & Party Size'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#121417] mb-1">
                    {language === 'bs' ? 'Datum večere / ručka *' : 'Reservation Date *'}
                  </label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-[#FAF8F5]/40 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#121417] mb-1">
                    {language === 'bs' ? 'Vrijeme dolaska *' : 'Time Slot *'}
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-white font-semibold"
                  >
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} h
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#121417] mb-1">
                    {language === 'bs' ? 'Broj gostiju *' : 'Number of Guests *'}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-xs p-3 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-white font-semibold"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? (language === 'bs' ? 'Osoba' : 'Guest') : (language === 'bs' ? 'Osobe/Gostiju' : 'Guests')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Seating Area */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#121417] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C5A059]" />
                <span>{language === 'bs' ? '2. Odaberite Željeni Ambijent' : '2. Preferred Seating Area'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {seatingAreas.map((area) => (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setSeatingArea(area.id as any)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                      seatingArea === area.id
                        ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#121417] shadow-sm'
                        : 'border-[#E8E2D6] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif text-base font-bold text-[#121417]">
                        {language === 'bs' ? area.nameBs : area.nameEn}
                      </span>
                      {seatingArea === area.id && <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />}
                    </div>
                    <p className="text-xs text-[#121417]/70 font-light">
                      {language === 'bs' ? area.descBs : area.descEn}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Special Occasion & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#121417] mb-1">
                  {language === 'bs' ? 'Poseban povod (opcionalno)' : 'Special Occasion (optional)'}
                </label>
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-white font-medium"
                >
                  {occasionsList.map((o) => (
                    <option key={o.id} value={o.id}>
                      {language === 'bs' ? o.labelBs : o.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#121417] mb-1">
                  {language === 'bs' ? 'Posebne želje (dječija stolica, alergije)' : 'Special Requests & Dietary Notes'}
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder={language === 'bs' ? 'Npr. Miran sto u uglu, dječija stolica' : 'e.g. Quiet corner, high chair'}
                  className="w-full text-xs p-3 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-[#FAF8F5]/30"
                />
              </div>
            </div>

            {/* Step 4: Customer Details */}
            <div>
              <h2 className="font-serif text-xl font-semibold text-[#121417] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#C5A059]" />
                <span>{language === 'bs' ? '3. Vaši Kontakt Podaci' : '3. Guest Contact Information'}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#121417] mb-1">
                    {language === 'bs' ? 'Ime i Prezime *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Mirza Hadžić"
                    className="w-full text-xs p-3 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-[#FAF8F5]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#121417] mb-1">
                    {language === 'bs' ? 'Broj Telefona *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+387 61 123 456"
                    className="w-full text-xs p-3 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-[#FAF8F5]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#121417] mb-1">
                    {language === 'bs' ? 'Email za potvrdu *' : 'Confirmation Email *'}
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="mirza@example.ba"
                    className="w-full text-xs p-3 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-[#FAF8F5]/30"
                  />
                </div>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] disabled:opacity-50 text-[#121417] font-semibold tracking-wider uppercase text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CalendarIcon className="w-5 h-5" />
              <span>
                {isSubmitting
                  ? (language === 'bs' ? 'Slanje rezervacije...' : 'Submitting Request...')
                  : (language === 'bs' ? 'Potvrdi Rezervaciju Stola' : 'Confirm Table Reservation')}
              </span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
};
