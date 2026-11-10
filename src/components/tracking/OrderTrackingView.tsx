import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { OrderStatus } from '../../types/restaurant';
import { 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Bike, 
  PackageCheck, 
  Phone, 
  Search, 
  ArrowLeft, 
  AlertCircle,
  MapPin,
  Utensils
} from 'lucide-react';

interface OrderTrackingViewProps {
  initialOrderNumber?: string;
  onBackToHome: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({ initialOrderNumber, onBackToHome }) => {
  const { language, orders, getOrder, settings } = useRestaurant();
  const [searchCode, setSearchCode] = useState(initialOrderNumber || '');
  const [activeOrderNumber, setActiveOrderNumber] = useState(initialOrderNumber || (orders[0]?.orderNumber || ''));

  const currentOrder = getOrder(activeOrderNumber);

  const statusSteps: { key: OrderStatus; labelBs: string; labelEn: string; icon: any }[] = [
    { key: 'new', labelBs: 'Narudžba Zaprimljena', labelEn: 'Order Received', icon: Clock },
    { key: 'confirmed', labelBs: 'Potvrđeno od Restorana', labelEn: 'Confirmed by Bistro', icon: CheckCircle2 },
    { key: 'preparing', labelBs: 'U Pripremi u Kuhinji', labelEn: 'Cooking in Kitchen', icon: ChefHat },
    { 
      key: currentOrder?.orderType === 'delivery' ? 'out_for_delivery' : 'ready', 
      labelBs: currentOrder?.orderType === 'delivery' ? 'Na Putu (Dostavljač)' : 'Spremno za Preuzimanje', 
      labelEn: currentOrder?.orderType === 'delivery' ? 'Out for Delivery' : 'Ready for Pickup', 
      icon: currentOrder?.orderType === 'delivery' ? Bike : PackageCheck 
    },
    { key: 'delivered', labelBs: 'Uručeno / Završeno', labelEn: 'Delivered / Completed', icon: CheckCircle2 },
  ];

  const getStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'new': return 0;
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      setActiveOrderNumber(searchCode.trim().toUpperCase());
    }
  };

  const activeIndex = currentOrder ? getStepIndex(currentOrder.status) : -1;

  return (
    <div className="py-12 bg-[#F7F4ED] text-[#20221F] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation & Search bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#59634A] hover:text-[#B66F52] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'bs' ? 'Povratak na Početnu' : 'Back to Home'}</span>
          </button>

          <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder={language === 'bs' ? 'Unesite broj npr. AB-2026-...' : 'Enter order # e.g. AB-2026-...'}
              className="text-xs uppercase px-3 py-2 rounded-xl border border-[#E9E1D4] focus:outline-none focus:border-[#B66F52] bg-white w-full sm:w-60 font-semibold"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#59634A] text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-[#3F4734] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{language === 'bs' ? 'Pronađi' : 'Track'}</span>
            </button>
          </form>
        </div>

        {!currentOrder ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E9E1D4] text-center shadow-sm max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-[#B66F52] mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-semibold text-[#20221F] mb-2">
              {language === 'bs' ? 'Narudžba nije pronađena' : 'Order Not Found'}
            </h2>
            <p className="text-xs text-[#20221F]/70 mb-6 leading-relaxed">
              {language === 'bs'
                ? `Nismo pronašli narudžbu pod brojem "${activeOrderNumber}". Molimo provjerite broj narudžbe i pokušajte ponovo.`
                : `We could not find an order with identifier "${activeOrderNumber}". Please verify your order number.`}
            </p>
            {orders.length > 0 && (
              <div className="text-left bg-[#F7F4ED] p-4 rounded-xl border border-[#E9E1D4]">
                <span className="text-xs font-bold text-[#59634A] block mb-2">
                  {language === 'bs' ? 'Vaše nedavne narudžbe na ovom uređaju:' : 'Recent orders on this device:'}
                </span>
                <div className="space-y-1">
                  {orders.slice(0, 3).map((o) => (
                    <button
                      key={o.orderNumber}
                      onClick={() => setActiveOrderNumber(o.orderNumber)}
                      className="text-xs font-mono font-semibold text-[#B66F52] hover:underline block"
                    >
                      {o.orderNumber} ({o.total.toFixed(2)} KM &bull; {o.status})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Order Status Banner */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E1D4] shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9E1D4]">
                <div>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#B66F52] block mb-1">
                    {language === 'bs' ? 'Status Praćenja Narudžbe' : 'Live Order Tracking'}
                  </span>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#20221F] font-mono">
                    #{currentOrder.orderNumber}
                  </h1>
                  <p className="text-xs text-[#20221F]/60 mt-1">
                    {language === 'bs' ? 'Zaprimljeno: ' : 'Placed: '}
                    {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                    {new Date(currentOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[11px] text-[#20221F]/60 block">
                      {language === 'bs' ? 'Procijenjeno vrijeme:' : 'Estimated Time:'}
                    </span>
                    <span className="font-serif text-lg font-bold text-[#59634A]">
                      {currentOrder.orderType === 'delivery' 
                        ? settings.estimatedDeliveryTime 
                        : (currentOrder.pickupTime || settings.estimatedPickupTime)}
                    </span>
                  </div>
                  <a
                    href={`tel:${settings.phone}`}
                    className="p-3 rounded-xl bg-[#F7F4ED] hover:bg-[#E9E1D4] text-[#59634A] border border-[#E9E1D4] transition-colors"
                    title={language === 'bs' ? 'Pozovi restoran' : 'Call restaurant'}
                    aria-label="Pozovi restoran"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Status Timeline Bar */}
              <div className="pt-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
                  {statusSteps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isDone = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-[#B66F52] text-white shadow-lg ring-4 ring-[#B66F52]/20 scale-105'
                              : isDone
                              ? 'bg-[#59634A] text-white'
                              : 'bg-stone-100 text-stone-400 border border-[#E9E1D4]'
                          }`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-xs mt-3 font-semibold ${
                            isCurrent ? 'text-[#B66F52]' : isDone ? 'text-[#20221F]' : 'text-stone-400'
                          }`}
                        >
                          {language === 'bs' ? step.labelBs : step.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Order Details & Delivery Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Items Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm space-y-4">
                <h3 className="font-serif text-xl font-semibold text-[#20221F] flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-[#59634A]" />
                  <span>{language === 'bs' ? 'Sadržaj Narudžbe' : 'Order Items'}</span>
                </h3>

                <div className="divide-y divide-[#E9E1D4]/60 text-xs">
                  {currentOrder.items.map((item) => (
                    <div key={item.cartItemId} className="py-2.5 flex items-start justify-between">
                      <div>
                        <div className="font-bold text-[#20221F]">
                          {item.quantity}x {language === 'bs' ? item.menuItem.name : item.menuItem.nameEn}
                        </div>
                        {item.selectedVariant && (
                          <div className="text-[11px] text-[#59634A]">{item.selectedVariant.name}</div>
                        )}
                        {item.selectedExtras.length > 0 && (
                          <div className="text-[10px] text-stone-500">
                            +{item.selectedExtras.map((e) => e.name).join(', ')}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-[#20221F]">{item.lineTotal.toFixed(2)} KM</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-[#E9E1D4] space-y-1 text-xs">
                  <div className="flex justify-between text-[#20221F]/70">
                    <span>{language === 'bs' ? 'Međuzbir' : 'Subtotal'}</span>
                    <span>{currentOrder.subtotal.toFixed(2)} KM</span>
                  </div>
                  {currentOrder.deliveryFee > 0 && (
                    <div className="flex justify-between text-[#20221F]/70">
                      <span>{language === 'bs' ? 'Dostava' : 'Delivery Fee'}</span>
                      <span>{currentOrder.deliveryFee.toFixed(2)} KM</span>
                    </div>
                  )}
                  {currentOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>{language === 'bs' ? 'Popust' : 'Discount'}</span>
                      <span>-{currentOrder.discount.toFixed(2)} KM</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-bold text-[#20221F] pt-2 border-t border-[#E9E1D4]">
                    <span>{language === 'bs' ? 'Ukupno' : 'Total'}</span>
                    <span className="font-serif text-xl text-[#B66F52]">{currentOrder.total.toFixed(2)} KM</span>
                  </div>
                </div>

              </div>

              {/* Delivery / Fulfillment Destination Card */}
              <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-[#20221F] flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-[#B66F52]" />
                    <span>{language === 'bs' ? 'Podaci o Isporuci' : 'Fulfillment Information'}</span>
                  </h3>

                  <div className="space-y-3 text-xs text-[#20221F]/80">
                    <div>
                      <span className="font-bold text-[#20221F] block">{currentOrder.customerName}</span>
                      <span>{currentOrder.customerPhone}</span>
                      <span className="text-stone-400 block">{currentOrder.customerEmail}</span>
                    </div>

                    <div className="pt-2 border-t border-[#E9E1D4]/60">
                      <span className="text-[11px] uppercase tracking-wider font-bold text-[#59634A] block mb-1">
                        {currentOrder.orderType === 'delivery' && (language === 'bs' ? 'Dostavna Adresa:' : 'Delivery Address:')}
                        {currentOrder.orderType === 'pickup' && (language === 'bs' ? 'Preuzimanje u Restoranu:' : 'Pickup Location:')}
                        {currentOrder.orderType === 'dine_in' && (language === 'bs' ? 'Sto u Restoranu:' : 'Dine-In Table:')}
                      </span>

                      {currentOrder.orderType === 'delivery' && currentOrder.deliveryAddress && (
                        <div>
                          <p className="font-semibold text-[#20221F]">
                            {currentOrder.deliveryAddress.street} {currentOrder.deliveryAddress.buildingNumber}
                            {currentOrder.deliveryAddress.apartment ? `, ${currentOrder.deliveryAddress.apartment}` : ''}
                          </p>
                          <p>{currentOrder.deliveryAddress.deliveryZone}, {currentOrder.deliveryAddress.city}</p>
                          {currentOrder.deliveryAddress.deliveryInstructions && (
                            <p className="italic text-stone-500 mt-1">
                              &ldquo;{currentOrder.deliveryAddress.deliveryInstructions}&rdquo;
                            </p>
                          )}
                        </div>
                      )}

                      {currentOrder.orderType === 'pickup' && (
                        <div>
                          <p className="font-semibold">{settings.address}, Sarajevo</p>
                          <p className="text-stone-500">{currentOrder.pickupTime}</p>
                        </div>
                      )}

                      {currentOrder.orderType === 'dine_in' && (
                        <div>
                          <p className="font-semibold text-lg text-[#59634A]">
                            {currentOrder.tableId || 'Sto u sali'}
                          </p>
                          <p className="text-stone-500">
                            {language === 'bs' ? 'Konobar će servirati hranu direktno na vaš sto.' : 'Food will be served directly to your table.'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-[#E9E1D4]/60">
                      <span className="text-[11px] text-stone-500 block">
                        {language === 'bs' ? 'Način plaćanja:' : 'Payment method:'}
                      </span>
                      <span className="font-semibold text-[#20221F] capitalize">
                        {currentOrder.paymentMethod.replace(/_/g, ' ')}
                      </span>
                    </div>

                  </div>
                </div>

                <div className="p-3 bg-[#F7F4ED] rounded-xl text-xs text-[#59634A] flex items-center justify-between mt-4">
                  <span>{language === 'bs' ? 'Pitanje u vezi narudžbe?' : 'Question about order?'}</span>
                  <a href={`tel:${settings.phone}`} className="font-bold underline hover:text-[#B66F52]">
                    {settings.phone}
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
