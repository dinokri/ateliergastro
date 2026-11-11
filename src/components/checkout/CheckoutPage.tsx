import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderType, PaymentMethod, DeliveryAddress } from '../../types/restaurant';
import { 
  Truck, 
  Store, 
  QrCode, 
  CreditCard, 
  Banknote, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

interface CheckoutPageProps {
  onBackToMenu: () => void;
  onOrderCompleted: (orderNumber: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBackToMenu, onOrderCompleted }) => {
  const {
    language,
    cart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    cartTotal,
    appliedPromo,
    settings,
    createOrder,
    activeTableId,
  } = useRestaurant();

  const [orderType, setOrderType] = useState<OrderType>(activeTableId ? 'dine_in' : 'delivery');
  
  // Customer details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Delivery details
  const [city, setCity] = useState('Sarajevo');
  const [street, setStreet] = useState('');
  const [buildingNumber, setBuildingNumber] = useState('');
  const [apartment, setApartment] = useState('');
  const [deliveryZone, setDeliveryZone] = useState('Stari Grad');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Pickup details
  const [pickupTime, setPickupTime] = useState('Za 25-35 minuta');

  // Table dine-in
  const [tableNumber, setTableNumber] = useState(activeTableId || 'Sto 1');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');

  // Notes & terms
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const deliveryZonesList = [
    { name: 'Stari Grad', time: '30-40 min', fee: 4.0 },
    { name: 'Centar', time: '35-45 min', fee: 4.0 },
    { name: 'Novo Sarajevo', time: '40-50 min', fee: 5.0 },
    { name: 'Novi Grad', time: '45-55 min', fee: 6.0 },
    { name: 'Ilidža', time: '50-60 min', fee: 7.0 },
  ];

  // Adjust fee based on order type
  const actualDeliveryFee = orderType === 'delivery' 
    ? (cartSubtotal >= settings.freeDeliveryThreshold ? 0 : settings.standardDeliveryFee)
    : 0;
  
  const finalCalculatedTotal = Math.max(0, cartSubtotal + actualDeliveryFee - discountAmount);

  if (cart.length === 0) {
    return (
      <div className="py-20 bg-[#FAF8F5] text-center px-4">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-[#E8E2D6] shadow-sm">
          <AlertCircle className="w-12 h-12 text-[#C5A059] mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-semibold text-[#121417] mb-2">
            {language === 'bs' ? 'Vaša korpa je prazna' : 'Your Cart is Empty'}
          </h2>
          <p className="text-xs text-[#121417]/70 mb-6">
            {language === 'bs'
              ? 'Dodajte artikle sa menija prije nego što nastavite sa plaćanjem.'
              : 'Please add items from our digital menu before proceeding.'}
          </p>
          <button
            onClick={onBackToMenu}
            className="w-full py-3.5 rounded-xl bg-[#121417] text-white hover:bg-[#C5A059] hover:text-[#121417] transition-colors text-xs font-semibold tracking-wider uppercase"
          >
            {language === 'bs' ? 'Vrati se na Meni' : 'Return to Menu'}
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim() || !customerEmail.trim()) {
      setErrorMsg(language === 'bs' ? 'Molimo popunite sva kontakt polja.' : 'Please fill in all contact fields.');
      return;
    }

    if (orderType === 'delivery' && (!street.trim() || !buildingNumber.trim())) {
      setErrorMsg(language === 'bs' ? 'Molimo unesite ulicu i broj za dostavu.' : 'Please provide complete delivery street and building number.');
      return;
    }

    if (orderType === 'delivery' && cartSubtotal < settings.minOrderAmount) {
      setErrorMsg(
        language === 'bs'
          ? `Minimalan iznos za dostavu je ${settings.minOrderAmount.toFixed(2)} KM.`
          : `Minimum order amount for delivery is ${settings.minOrderAmount.toFixed(2)} KM.`
      );
      return;
    }

    if (!termsAccepted) {
      setErrorMsg(
        language === 'bs'
          ? 'Molimo prihvatite uslove naručivanja i politiku privatnosti.'
          : 'Please accept order terms and conditions.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const deliveryAddressData: DeliveryAddress | undefined =
        orderType === 'delivery'
          ? {
              city,
              street,
              buildingNumber,
              apartment: apartment.trim() || undefined,
              deliveryZone,
              deliveryInstructions: deliveryInstructions.trim() || undefined,
            }
          : undefined;

      const newOrder = await createOrder({
        orderType,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim(),
        deliveryAddress: deliveryAddressData,
        pickupTime: orderType === 'pickup' ? pickupTime : undefined,
        tableId: orderType === 'dine_in' ? tableNumber : undefined,
        items: cart,
        subtotal: cartSubtotal,
        deliveryFee: actualDeliveryFee,
        discount: discountAmount,
        promoCode: appliedPromo?.code,
        total: finalCalculatedTotal,
        paymentMethod,
        specialInstructions: specialInstructions.trim() || undefined,
      });

      setIsSubmitting(false);
      onOrderCompleted(newOrder.orderNumber);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(language === 'bs' ? 'Došlo je do greške prilikom kreiranja narudžbe. Pokušajte ponovo.' : 'Failed to create order. Please try again.');
    }
  };

  return (
    <div className="py-12 bg-[#FAF8F5] text-[#121417] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A059] hover:text-[#121417] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bs' ? 'Nazad na pregled menija' : 'Back to Menu'}</span>
        </button>

        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-[#121417] mb-2">
          {language === 'bs' ? 'Završetak Narudžbe & Plaćanje' : 'Checkout & Order Summary'}
        </h1>
        <p className="text-xs sm:text-sm text-[#121417]/70 mb-8 font-light">
          {language === 'bs'
            ? 'Odaberite način preuzimanja, unesite vaše podatke i potvrdite narudžbu.'
            : 'Select fulfillment type, review your order and select payment method.'}
        </p>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="space-y-8">
          
          {/* Section 1: Order Type Selector */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D6] shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#121417]">
              {language === 'bs' ? '1. Način Naručivanja' : '1. Fulfillment Method'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Delivery Option */}
              <button
                type="button"
                onClick={() => {
                  setOrderType('delivery');
                  setPaymentMethod('cash_on_delivery');
                }}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  orderType === 'delivery'
                    ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#121417] shadow-sm'
                    : 'border-[#E8E2D6] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Truck className="w-5 h-5 text-[#C5A059]" />
                  {orderType === 'delivery' && <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />}
                </div>
                <div>
                  <span className="font-bold text-xs block">{language === 'bs' ? 'Dostava na Adresu' : 'Home Delivery'}</span>
                  <span className="text-[11px] text-[#121417]/60">
                    {language === 'bs' ? 'Sarajevo i okolina (35-45 min)' : 'Delivered to your door'}
                  </span>
                </div>
              </button>

              {/* Takeaway Pickup */}
              <button
                type="button"
                onClick={() => {
                  setOrderType('pickup');
                  setPaymentMethod('cash_on_pickup');
                }}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  orderType === 'pickup'
                    ? 'border-[#C5A059] bg-[#C5A059]/10 text-[#121417] shadow-sm'
                    : 'border-[#E8E2D6] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Store className="w-5 h-5 text-[#C5A059]" />
                  {orderType === 'pickup' && <CheckCircle2 className="w-4 h-4 text-[#C5A059]" />}
                </div>
                <div>
                  <span className="font-bold text-xs block">{language === 'bs' ? 'Lično Preuzimanje' : 'Takeaway Pickup'}</span>
                  <span className="text-[11px] text-[#121417]/60">
                    {language === 'bs' ? 'Obala Kulina bana 24' : 'Atelier Bistro counter'}
                  </span>
                </div>
              </button>

              {/* Dine-in Table */}
              <button
                type="button"
                onClick={() => {
                  setOrderType('dine_in');
                  setPaymentMethod('pay_at_restaurant');
                }}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  orderType === 'dine_in'
                    ? 'border-[#121417] bg-[#121417]/5 text-[#121417] shadow-sm'
                    : 'border-[#E8E2D6] hover:bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <QrCode className="w-5 h-5 text-[#121417]" />
                  {orderType === 'dine_in' && <CheckCircle2 className="w-4 h-4 text-[#121417]" />}
                </div>
                <div>
                  <span className="font-bold text-xs block">{language === 'bs' ? 'Narudžba za Stol' : 'Dine-In Table QR'}</span>
                  <span className="text-[11px] text-[#121417]/60">
                    {activeTableId ? `Aktivni sto: ${activeTableId}` : (language === 'bs' ? 'Posluživanje za vašim stolom' : 'Direct table service')}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Customer Contact Info */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#20221F]">
              {language === 'bs' ? '2. Kontakt Podaci' : '2. Contact Details'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#20221F] mb-1">
                  {language === 'bs' ? 'Ime i Prezime *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Npr. Mirza Begić"
                  className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20221F] mb-1">
                  {language === 'bs' ? 'Broj Telefona *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+387 61 000 000"
                  className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20221F] mb-1">
                  {language === 'bs' ? 'Email Adresa (za potvrdu) *' : 'Email Address *'}
                </label>
                <input
                  type="email"
                  required
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="mirza@example.ba"
                  className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Delivery or Pickup Details */}
          {orderType === 'delivery' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#20221F]">
                {language === 'bs' ? '3. Adresa za Dostavu' : '3. Delivery Address'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Grad' : 'City'}
                  </label>
                  <input
                    type="text"
                    disabled
                    value={city}
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] bg-stone-100 text-stone-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Zona Dostave' : 'Delivery Zone'}
                  </label>
                  <select
                    value={deliveryZone}
                    onChange={(e) => setDeliveryZone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-white font-medium"
                  >
                    {deliveryZonesList.map((z) => (
                      <option key={z.name} value={z.name}>
                        {z.name} ({z.time})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Ulica *' : 'Street *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder={language === 'bs' ? 'Npr. Ferhadija' : 'Street name'}
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">
                      {language === 'bs' ? 'Broj *' : 'Building # *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={buildingNumber}
                      onChange={(e) => setBuildingNumber(e.target.value)}
                      placeholder="Npr. 12"
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">
                      {language === 'bs' ? 'Stan / Sprat' : 'Apt / Floor'}
                    </label>
                    <input
                      type="text"
                      value={apartment}
                      onChange={(e) => setApartment(e.target.value)}
                      placeholder="Npr. Stan 4, 2. sprat"
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#20221F] mb-1">
                  {language === 'bs' ? 'Upute za dostavljača (interfon, kod za ulaz)' : 'Delivery courier notes'}
                </label>
                <input
                  type="text"
                  value={deliveryInstructions}
                  onChange={(e) => setDeliveryInstructions(e.target.value)}
                  placeholder={language === 'bs' ? 'Npr. Interfon Begić, ulaz sa desne strane' : 'e.g. Ring Begić, second entrance'}
                  className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30"
                />
              </div>
            </div>
          )}

          {orderType === 'pickup' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#20221F]">
                {language === 'bs' ? '3. Vrijeme Preuzimanja' : '3. Pickup Schedule'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Željeno vrijeme' : 'Desired Pickup Time'}
                  </label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-white font-medium"
                  >
                    <option value="Za 20-30 min">{language === 'bs' ? 'Što prije (20-30 min)' : 'ASAP (20-30 min)'}</option>
                    <option value="Za 45 min">{language === 'bs' ? 'Za 45 min' : 'In 45 minutes'}</option>
                    <option value="Za 1 sat">{language === 'bs' ? 'Za 1 sat' : 'In 1 hour'}</option>
                  </select>
                </div>
                <div className="p-3 bg-[#F7F4ED] rounded-xl text-xs text-[#59634A] flex items-center gap-2">
                  <MapPin className="w-5 h-5 shrink-0 text-[#B66F52]" />
                  <span>
                    {language === 'bs' 
                      ? 'Preuzimate na šanku restorana: Obala Kulina bana 24, Sarajevo.' 
                      : 'Pick up at restaurant bar: Obala Kulina bana 24, Sarajevo.'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {orderType === 'dine_in' && (
            <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-semibold text-[#20221F]">
                {language === 'bs' ? '3. Broj Stola u Restoranu' : '3. Restaurant Table Number'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-semibold text-[#20221F] mb-1">
                    {language === 'bs' ? 'Oznaka stola *' : 'Table identifier *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    placeholder="Npr. Sto 7 ili Terasa 3"
                    className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-[#F7F4ED]/30 font-semibold"
                  />
                </div>
                <div className="text-xs text-[#20221F]/70">
                  {language === 'bs'
                    ? 'Identifikator sa QR koda na vašem stolu. Narudžba se prosljeđuje direktno kuhinji i šanku.'
                    : 'Scanned from your table QR code. Items will be directly prepared and served to your seat.'}
                </div>
              </div>
            </div>
          )}

          {/* Section 4: Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#20221F]">
              {language === 'bs' ? '4. Način Plaćanja' : '4. Payment Method'}
            </h2>

            <div className="space-y-3">
              {orderType === 'delivery' && (
                <label className="p-3.5 rounded-xl border border-[#E9E1D4] hover:bg-[#F7F4ED] flex items-center justify-between cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cash_on_delivery'}
                      onChange={() => setPaymentMethod('cash_on_delivery')}
                      className="text-[#C5A059] focus:ring-0"
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-xs font-semibold text-[#121417]">
                        {language === 'bs' ? 'Gotovinom prilikom dostave (Cash on delivery)' : 'Cash on delivery'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#121417]/60">BAM (KM)</span>
                </label>
              )}

              {orderType === 'pickup' && (
                <label className="p-3.5 rounded-xl border border-[#E8E2D6] hover:bg-[#FAF8F5] flex items-center justify-between cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cash_on_pickup'}
                      onChange={() => setPaymentMethod('cash_on_pickup')}
                      className="text-[#C5A059] focus:ring-0"
                    />
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-xs font-semibold text-[#121417]">
                        {language === 'bs' ? 'Gotovinom ili karticom prilikom preuzimanja' : 'Pay upon pickup (Cash or Card)'}
                      </span>
                    </div>
                  </div>
                </label>
              )}

              {orderType === 'dine_in' && (
                <label className="p-3.5 rounded-xl border border-[#E8E2D6] hover:bg-[#FAF8F5] flex items-center justify-between cursor-pointer transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'pay_at_restaurant'}
                      onChange={() => setPaymentMethod('pay_at_restaurant')}
                      className="text-[#C5A059] focus:ring-0"
                    />
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#C5A059]" />
                      <span className="text-xs font-semibold text-[#121417]">
                        {language === 'bs' ? 'Plaćanje konobaru za stolom (gotovina/kartica)' : 'Pay waitstaff at table (Cash/Card)'}
                      </span>
                    </div>
                  </div>
                </label>
              )}

              {/* Online Card Option */}
              <label className="p-3.5 rounded-xl border border-[#E8E2D6] hover:bg-[#FAF8F5] flex items-center justify-between cursor-pointer transition-colors">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'card_online'}
                    onChange={() => setPaymentMethod('card_online')}
                    className="text-[#C5A059] focus:ring-0"
                  />
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-xs font-semibold text-[#121417]">
                      {language === 'bs' ? 'Online Plaćanje Karticom (Visa, Mastercard)' : 'Online Card Payment'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                  Sandbox Monri BiH
                </span>
              </label>
            </div>
          </div>

          {/* Section 5: Order Breakdown & Submission */}
          <div className="bg-white p-6 rounded-2xl border border-[#E8E2D6] shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#121417]">
              {language === 'bs' ? '5. Pregled Računa' : '5. Order Summary'}
            </h2>

            <div className="divide-y divide-[#E8E2D6]/60 text-xs">
              {cart.map((item) => (
                <div key={item.cartItemId} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#C5A059]">{item.quantity}x</span>
                    <span>{language === 'bs' ? item.menuItem.name : item.menuItem.nameEn}</span>
                    {item.selectedVariant && (
                      <span className="text-stone-400">({item.selectedVariant.name})</span>
                    )}
                  </div>
                  <span className="font-semibold text-[#121417]">{item.lineTotal.toFixed(2)} KM</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E8E2D6] space-y-2 text-xs">
              <div className="flex justify-between text-[#121417]/80">
                <span>{language === 'bs' ? 'Međuzbir stavki' : 'Items Subtotal'}</span>
                <span>{cartSubtotal.toFixed(2)} KM</span>
              </div>

              {orderType === 'delivery' && (
                <div className="flex justify-between text-[#121417]/80">
                  <span>{language === 'bs' ? 'Troškovi dostave' : 'Delivery Fee'}</span>
                  <span>
                    {actualDeliveryFee === 0 ? (
                      <strong className="text-emerald-700 uppercase">Besplatno</strong>
                    ) : (
                      `${actualDeliveryFee.toFixed(2)} KM`
                    )}
                  </span>
                </div>
              )}

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>{language === 'bs' ? `Popust (${appliedPromo?.code})` : 'Promotional Discount'}</span>
                  <span>-{discountAmount.toFixed(2)} KM</span>
                </div>
              )}

              <div className="flex justify-between text-base font-bold text-[#121417] pt-2 border-t border-[#E8E2D6]">
                <span>{language === 'bs' ? 'Ukupno za naplatu' : 'Total Amount'}</span>
                <span className="font-serif text-2xl text-[#C5A059] font-bold">{finalCalculatedTotal.toFixed(2)} KM</span>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-2.5 text-xs text-[#121417]/70 pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded border-[#E8E2D6] text-[#C5A059] focus:ring-0"
              />
              <span>
                {language === 'bs'
                  ? 'Potvrđujem tačnost unesenih podataka i prihvatam uslove naručivanja i politiku privatnosti Atelier Bistro restorana.'
                  : 'I confirm order accuracy and accept Atelier Bistro dining terms and privacy conditions.'}
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-8 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] disabled:opacity-50 text-[#121417] font-semibold tracking-wider uppercase text-sm shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>
                {isSubmitting
                  ? (language === 'bs' ? 'Slanje narudžbe...' : 'Processing...')
                  : `${language === 'bs' ? 'Potvrdi i Pošalji Narudžbu' : 'Confirm & Place Order'} (${finalCalculatedTotal.toFixed(2)} KM)`}
              </span>
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};
