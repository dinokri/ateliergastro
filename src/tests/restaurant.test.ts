import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemUnitPrice,
  calculateCartSubtotal,
  calculateDeliveryFee,
  validateAndApplyDiscount,
  calculateOrderTotal,
  generateOrderNumber,
  isWithinOperatingHours,
} from '../utils/pricing';
import { CartItem, MenuItem, OpeningHour, Promotion } from '../types/restaurant';

test('calculateItemUnitPrice adds base price, variant delta, and extras precisely', () => {
  const basePrice = 28.5; // 28.50 BAM
  const variant = { id: 'v1', name: 'Velika porcija', nameEn: 'Large portion', priceDelta: 6.0 };
  const extras = [
    { id: 'e1', name: 'Crni tartuf', nameEn: 'Black truffle', price: 4.5 },
    { id: 'e2', name: 'Ekstra parmezan', nameEn: 'Extra parmesan', price: 2.0 },
  ];

  const unitPrice = calculateItemUnitPrice(basePrice, variant, extras);
  assert.equal(unitPrice, 41.0);
});

test('calculateCartSubtotal computes correct total across multiple line items', () => {
  const dummyMenuItem: MenuItem = {
    id: 'm1',
    categoryId: 'c1',
    name: 'Bistecca Fiorentina',
    nameEn: 'Florentine Steak',
    shortDescription: 'Dry-aged odrezak',
    shortDescriptionEn: 'Dry-aged steak',
    description: 'Opis',
    descriptionEn: 'Desc',
    ingredients: 'Goveđe meso, morska so, ruzmarin',
    ingredientsEn: 'Beef, sea salt, rosemary',
    price: 45.0,
    prepTimeMinutes: 25,
    isAvailable: true,
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800',
    dietaryTags: ['gluten-free'],
    allergens: [],
  };

  const items: CartItem[] = [
    {
      cartItemId: 'item-1',
      menuItem: dummyMenuItem,
      quantity: 2,
      itemPrice: 45.0,
      lineTotal: 90.0,
      selectedExtras: [],
    },
    {
      cartItemId: 'item-2',
      menuItem: { ...dummyMenuItem, id: 'm2', price: 12.5 },
      quantity: 1,
      itemPrice: 12.5,
      lineTotal: 12.5,
      selectedExtras: [],
    },
  ];

  const subtotal = calculateCartSubtotal(items);
  assert.equal(subtotal, 102.5);
});

test('calculateDeliveryFee respects order type and free delivery threshold', () => {
  const settings = {
    standardDeliveryFee: 4.0,
    freeDeliveryThreshold: 50.0,
  };

  // Delivery below threshold
  assert.equal(calculateDeliveryFee(35.0, settings, 'delivery'), 4.0);

  // Delivery above threshold
  assert.equal(calculateDeliveryFee(55.0, settings, 'delivery'), 0.0);

  // Delivery exact threshold
  assert.equal(calculateDeliveryFee(50.0, settings, 'delivery'), 0.0);

  // Pickup always 0 fee
  assert.equal(calculateDeliveryFee(30.0, settings, 'pickup'), 0.0);

  // Dine-in always 0 fee
  assert.equal(calculateDeliveryFee(30.0, settings, 'dine_in'), 0.0);
});

test('validateAndApplyDiscount applies percentage and fixed coupons correctly', () => {
  const percentagePromo: Promotion = {
    code: 'ATELIER15',
    discountType: 'percentage',
    discountValue: 15,
    minOrderAmount: 40.0,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isActive: true,
    usageCount: 5,
  };

  // Valid order (60 KM)
  const result1 = validateAndApplyDiscount(60.0, percentagePromo);
  assert.equal(result1.isValid, true);
  assert.equal(result1.discountAmount, 9.0); // 15% of 60 = 9

  // Below min order (30 KM < 40 KM)
  const result2 = validateAndApplyDiscount(30.0, percentagePromo);
  assert.equal(result2.isValid, false);
  assert.equal(result2.discountAmount, 0);

  // Inactive promo
  const result3 = validateAndApplyDiscount(60.0, { ...percentagePromo, isActive: false });
  assert.equal(result3.isValid, false);

  // Fixed discount
  const fixedPromo: Promotion = {
    code: 'BISTRO10',
    discountType: 'fixed',
    discountValue: 10.0,
    minOrderAmount: 25.0,
    validFrom: '2026-01-01',
    validUntil: '2026-12-31',
    isActive: true,
    usageCount: 2,
  };
  const result4 = validateAndApplyDiscount(50.0, fixedPromo);
  assert.equal(result4.isValid, true);
  assert.equal(result4.discountAmount, 10.0);
});

test('calculateOrderTotal computes final price accurately without negative total', () => {
  assert.equal(calculateOrderTotal(100.0, 4.0, 15.0), 89.0);
  assert.equal(calculateOrderTotal(20.0, 0, 50.0), 0.0); // Discount exceeds subtotal
});

test('generateOrderNumber returns valid Atelier Bistro formatted code', () => {
  const code = generateOrderNumber();
  assert.match(code, /^AB-\d{4}-\d{4}$/);
});

test('isWithinOperatingHours correctly validates reservation times and blocked slots', () => {
  const standardHours: OpeningHour[] = [
    { day: 'Ponedjeljak', dayEn: 'Monday', open: '12:00', close: '23:00', isClosed: false },
    { day: 'Utorak', dayEn: 'Tuesday', open: '12:00', close: '23:00', isClosed: false },
    { day: 'Srijeda', dayEn: 'Wednesday', open: '12:00', close: '23:00', isClosed: false },
    { day: 'Četvrtak', dayEn: 'Thursday', open: '12:00', close: '23:00', isClosed: false },
    { day: 'Petak', dayEn: 'Friday', open: '12:00', close: '00:00', isClosed: false },
    { day: 'Subota', dayEn: 'Saturday', open: '12:00', close: '00:00', isClosed: false },
    { day: 'Nedjelja', dayEn: 'Sunday', open: '12:00', close: '22:00', isClosed: true }, // Closed on Sundays
  ];

  // Monday at 18:00 (Valid)
  const mondayCheck = isWithinOperatingHours('2026-11-16', '18:00', standardHours);
  assert.equal(mondayCheck.allowed, true);

  // Sunday (Closed)
  const sundayCheck = isWithinOperatingHours('2026-11-15', '18:00', standardHours);
  assert.equal(sundayCheck.allowed, false);

  // Monday before opening (10:00)
  const earlyCheck = isWithinOperatingHours('2026-11-16', '10:00', standardHours);
  assert.equal(earlyCheck.allowed, false);
});
