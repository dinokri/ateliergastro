export type Language = 'bs' | 'en';

export type DietaryTag = 
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'spicy'
  | 'nut-free';

export type Allergen = 
  | 'gluten'
  | 'crustaceans'
  | 'eggs'
  | 'fish'
  | 'peanuts'
  | 'soybeans'
  | 'milk'
  | 'nuts'
  | 'celery'
  | 'mustard'
  | 'sesame'
  | 'sulphites';

export interface ItemVariant {
  id: string;
  name: string;
  nameEn: string;
  priceDelta: number; // in BAM
}

export interface ItemExtra {
  id: string;
  name: string;
  nameEn: string;
  price: number; // in BAM
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  shortDescription: string;
  shortDescriptionEn: string;
  description: string;
  descriptionEn: string;
  ingredients: string;
  ingredientsEn: string;
  price: number; // in BAM
  prepTimeMinutes: number;
  calories?: number;
  isAvailable: boolean;
  isBestseller?: boolean;
  isChefRecommendation?: boolean;
  isNew?: boolean;
  imageUrl: string;
  dietaryTags: DietaryTag[];
  allergens: Allergen[];
  variants?: ItemVariant[];
  extras?: ItemExtra[];
}

export interface MenuCategory {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  type: 'food' | 'drinks';
  imageUrl: string;
  displayOrder: number;
  isVisible: boolean;
}

export interface CartItem {
  cartItemId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedVariant?: ItemVariant;
  selectedExtras: ItemExtra[];
  specialInstructions?: string;
  itemPrice: number; // calculated single item price
  lineTotal: number; // itemPrice * quantity
}

export type OrderType = 'delivery' | 'pickup' | 'dine_in';

export type OrderStatus =
  | 'new'
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export type PaymentMethod =
  | 'cash_on_delivery'
  | 'cash_on_pickup'
  | 'pay_at_restaurant'
  | 'card_online';

export interface DeliveryAddress {
  city: string;
  street: string;
  buildingNumber: string;
  apartment?: string;
  deliveryZone: string;
  deliveryInstructions?: string;
}

export interface Order {
  id?: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress?: DeliveryAddress;
  pickupTime?: string;
  tableId?: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  promoCode?: string;
  total: number;
  paymentMethod: PaymentMethod;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  internalNotes?: string;
}

export type ReservationStatus =
  | 'pending'
  | 'confirmed'
  | 'rejected'
  | 'cancelled'
  | 'completed'
  | 'no_show';

export interface Reservation {
  id?: string;
  reservationNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  guests: number;
  seatingArea: 'indoor_salon' | 'olive_terrace' | 'chef_table' | 'wine_cellar';
  occasion?: string;
  specialRequests?: string;
  status: ReservationStatus;
  internalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventInquiry {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  eventType: 'birthday' | 'corporate' | 'private_dining' | 'wedding' | 'catering';
  preferredDate: string;
  guestsCount: number;
  additionalRequests?: string;
  status: 'new' | 'in_progress' | 'confirmed' | 'archived';
  createdAt: string;
}

export interface Promotion {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 15 for 15% or 10 for 10 BAM
  minOrderAmount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
}

export interface OpeningHour {
  day: string;
  dayEn: string;
  open: string;
  close: string;
  isClosed: boolean;
}

export interface RestaurantSettings {
  name: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  currency: string; // "KM" or "BAM"
  timezone: string; // "Europe/Sarajevo"
  lat: number;
  lng: number;
  isDeliveryEnabled: boolean;
  isPickupEnabled: boolean;
  isTableOrderingEnabled: boolean;
  minOrderAmount: number;
  standardDeliveryFee: number;
  freeDeliveryThreshold: number;
  estimatedDeliveryTime: string;
  estimatedPickupTime: string;
  maxTableCapacity: number;
  openingHours: OpeningHour[];
  supportedPaymentMethods: {
    cashOnDelivery: boolean;
    cashOnPickup: boolean;
    payAtRestaurant: boolean;
    cardOnline: boolean;
  };
}

export interface GuestReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  commentEn: string;
  source: string;
}
