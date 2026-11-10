import { CartItem, ItemExtra, ItemVariant, Promotion, RestaurantSettings, OpeningHour } from '../types/restaurant';

/**
 * Calculates single unit price of an item including selected variant and extras.
 * Minor unit / cent safe calculation to avoid floating point errors.
 */
export function calculateItemUnitPrice(
  basePrice: number,
  selectedVariant?: ItemVariant,
  selectedExtras: ItemExtra[] = []
): number {
  const baseCents = Math.round(basePrice * 100);
  const variantDeltaCents = selectedVariant ? Math.round(selectedVariant.priceDelta * 100) : 0;
  const extrasCents = selectedExtras.reduce(
    (acc, extra) => acc + Math.round(extra.price * 100),
    0
  );
  return (baseCents + variantDeltaCents + extrasCents) / 100;
}

/**
 * Calculates cart subtotal from items.
 */
export function calculateCartSubtotal(items: CartItem[]): number {
  const subtotalCents = items.reduce((acc, item) => {
    const itemCents = Math.round(item.itemPrice * 100);
    return acc + itemCents * item.quantity;
  }, 0);
  return subtotalCents / 100;
}

/**
 * Computes delivery fee based on order type, subtotal and restaurant settings.
 * Returns 0 if pickup or dine-in, or if subtotal reaches freeDeliveryThreshold.
 */
export function calculateDeliveryFee(
  subtotal: number,
  settings: Pick<RestaurantSettings, 'standardDeliveryFee' | 'freeDeliveryThreshold'>,
  orderType: 'delivery' | 'pickup' | 'dine_in'
): number {
  if (orderType !== 'delivery') {
    return 0;
  }
  if (subtotal <= 0) {
    return 0;
  }
  if (subtotal >= settings.freeDeliveryThreshold) {
    return 0;
  }
  return settings.standardDeliveryFee;
}

/**
 * Validates promotion code against order subtotal and active status.
 */
export function validateAndApplyDiscount(
  subtotal: number,
  promo: Promotion | null | undefined
): { isValid: boolean; discountAmount: number; message: string } {
  if (!promo) {
    return { isValid: false, discountAmount: 0, message: '' };
  }

  if (!promo.isActive) {
    return { isValid: false, discountAmount: 0, message: 'Promocijski kod nije više aktivan' };
  }

  if (promo.minOrderAmount > 0 && subtotal < promo.minOrderAmount) {
    return {
      isValid: false,
      discountAmount: 0,
      message: `Minimalan iznos narudžbe za ovaj kod je ${promo.minOrderAmount.toFixed(2)} KM`,
    };
  }

  const subtotalCents = Math.round(subtotal * 100);
  let discountCents = 0;

  if (promo.discountType === 'percentage') {
    discountCents = Math.round((subtotalCents * promo.discountValue) / 100);
  } else {
    discountCents = Math.min(subtotalCents, Math.round(promo.discountValue * 100));
  }

  const discountAmount = discountCents / 100;
  return {
    isValid: true,
    discountAmount,
    message: `Popust uspješno primijenjen: -${discountAmount.toFixed(2)} KM`,
  };
}

/**
 * Calculates overall order total.
 */
export function calculateOrderTotal(
  subtotal: number,
  deliveryFee: number,
  discount: number
): number {
  const subtotalCents = Math.round(subtotal * 100);
  const deliveryCents = Math.round(deliveryFee * 100);
  const discountCents = Math.round(discount * 100);

  const totalCents = Math.max(0, subtotalCents + deliveryCents - discountCents);
  return totalCents / 100;
}

/**
 * Generates human-readable unique order number (e.g. AB-2026-9481).
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `AB-${year}-${randomSuffix}`;
}

/**
 * Generates unique reservation reference (e.g. RES-8419).
 */
export function generateReservationNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `RES-${randomSuffix}`;
}

/**
 * Checks whether requested reservation date & time is within restaurant operating hours.
 */
export function isWithinOperatingHours(
  dateStr: string,
  timeStr: string,
  openingHours: OpeningHour[]
): { allowed: boolean; reason?: string } {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { allowed: false, reason: 'Nevažeći datum' };
  }

  // Day index: 0 = Sunday, 1 = Monday, etc.
  const dayOfWeek = date.getDay();
  // Map JS day to our openingHours array: Monday = 0, Tuesday = 1, ... Sunday = 6
  const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const schedule = openingHours[adjustedIndex];

  if (!schedule || schedule.isClosed) {
    return { allowed: false, reason: 'Restoran je zatvoren na odabrani dan' };
  }

  const [resHour, resMin] = timeStr.split(':').map(Number);
  const [openHour, openMin] = schedule.open.split(':').map(Number);
  const [closeHour, closeMin] = schedule.close.split(':').map(Number);

  const resTotalMins = resHour * 60 + resMin;
  const openTotalMins = openHour * 60 + openMin;
  const closeTotalMins = closeHour * 60 + closeMin;

  // Last reservation is 1 hour before closing
  if (resTotalMins < openTotalMins || resTotalMins > closeTotalMins - 60) {
    return {
      allowed: false,
      reason: `Rezervacije su moguće između ${schedule.open} i ${String(closeHour - 1).padStart(2, '0')}:${String(closeMin).padStart(2, '0')}`,
    };
  }

  return { allowed: true };
}
