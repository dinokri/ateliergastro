import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CartItem,
  ItemExtra,
  Language,
  MenuCategory,
  MenuItem,
  Order,
  OrderStatus,
  OrderType,
  Promotion,
  Reservation,
  ReservationStatus,
  RestaurantSettings,
  EventInquiry,
} from '../types/restaurant';
import {
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_PROMOTIONS,
  INITIAL_SETTINGS,
} from '../data/seedData';
import {
  calculateItemUnitPrice,
  calculateCartSubtotal,
  calculateDeliveryFee,
  calculateOrderTotal,
  generateOrderNumber,
  generateReservationNumber,
  validateAndApplyDiscount,
} from '../utils/pricing';
import {
  syncInitialDataFromFirestore,
  saveOrderToFirestore,
  saveReservationToFirestore,
  saveEventInquiryToFirestore,
  saveNewsletterSubscription,
  saveMenuItemToFirestore,
  deleteMenuItemFromFirestore,
  saveSettingsToFirestore,
} from '../services/firestoreService';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface RestaurantContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  settings: RestaurantSettings;
  updateSettings: (newSettings: Partial<RestaurantSettings>) => Promise<void>;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  updateMenuItem: (item: MenuItem) => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  deleteMenuItem: (itemId: string) => Promise<void>;
  toggleItemAvailability: (itemId: string) => Promise<void>;
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    quantity?: number,
    variantId?: string,
    extraIds?: string[],
    specialInstructions?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  discountAmount: number;
  cartTotal: number;
  finalTotal: number;
  promotions: Promotion[];
  appliedPromo: Promotion | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  orders: Order[];
  submitOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderNumber: string, status: OrderStatus, notes?: string) => Promise<void>;
  getOrder: (orderNumber: string) => Order | undefined;
  reservations: Reservation[];
  createReservation: (resData: Omit<Reservation, 'reservationNumber' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Reservation>;
  updateReservationStatus: (reservationNumber: string, status: ReservationStatus, internalNotes?: string) => Promise<void>;
  eventInquiries: EventInquiry[];
  submitEventInquiry: (inquiry: Omit<EventInquiry, 'status' | 'createdAt'>) => Promise<void>;
  subscribeNewsletter: (email: string) => Promise<{ success: boolean; message: string }>;
  activeTableId: string | null;
  setActiveTableId: (tableId: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedDish: MenuItem | null;
  setSelectedDish: (dish: MenuItem | null) => void;
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeToast: (id: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bs');
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('atelier_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [categories, setCategories] = useState<MenuCategory[]>(() => {
    const saved = localStorage.getItem('atelier_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('atelier_menu_items');
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atelier_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [promotions, setPromotions] = useState<Promotion[]>(INITIAL_PROMOTIONS);
  const [appliedPromo, setAppliedPromo] = useState<Promotion | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('atelier_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem('atelier_reservations');
    return saved ? JSON.parse(saved) : [];
  });

  const [eventInquiries, setEventInquiries] = useState<EventInquiry[]>(() => {
    const saved = localStorage.getItem('atelier_event_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTableId, setActiveTableId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Check URL query parameters on mount (e.g. ?table=5 or ?order=AB-2026-1234)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tableParam = params.get('table');
      if (tableParam) {
        setActiveTableId(tableParam);
        addToast(
          'info',
          language === 'bs' ? 'Sto identifikovan' : 'Table identified',
          language === 'bs' ? `Prijavljeni ste na Stolu #${tableParam}` : `Ordering for Table #${tableParam}`
        );
      }
    } catch {
      // ignore
    }
  }, []);

  // Save changes to localStorage for offline robustness
  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('atelier_menu_items', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('atelier_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atelier_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('atelier_event_inquiries', JSON.stringify(eventInquiries));
  }, [eventInquiries]);

  // Firestore synchronization safely deferred to idle time to never block FCP/LCP
  useEffect(() => {
    const runSync = () => {
      syncInitialDataFromFirestore(
        (newSettings) => setSettings(newSettings),
        (newItems) => setMenuItems(newItems)
      );
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = (window as any).requestIdleCallback(runSync, { timeout: 3000 });
      return () => (window as any).cancelIdleCallback(idleId);
    } else {
      const timer = setTimeout(runSync, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (
    item: MenuItem,
    quantity = 1,
    variantId?: string,
    extraIds?: string[],
    specialInstructions?: string
  ) => {
    const selectedVariant = item.variants?.find((v) => v.id === variantId);
    const selectedExtras: ItemExtra[] = (item.extras || []).filter((e) =>
      extraIds?.includes(e.id)
    );

    const unitPrice = calculateItemUnitPrice(item.price, selectedVariant, selectedExtras);
    const lineTotal = (Math.round(unitPrice * 100) * quantity) / 100;
    const cartItemId = `${item.id}-${variantId || 'std'}-${(extraIds || []).sort().join('_')}`;

    setCart((prev) => {
      const existing = prev.find((ci) => ci.cartItemId === cartItemId);
      if (existing) {
        const newQty = existing.quantity + quantity;
        const newLineTotal = (Math.round(unitPrice * 100) * newQty) / 100;
        return prev.map((ci) =>
          ci.cartItemId === cartItemId
            ? { ...ci, quantity: newQty, lineTotal: newLineTotal }
            : ci
        );
      }

      const newItem: CartItem = {
        cartItemId,
        menuItem: item,
        quantity,
        selectedVariant,
        selectedExtras,
        specialInstructions,
        itemPrice: unitPrice,
        lineTotal,
      };
      return [...prev, newItem];
    });

    addToast(
      'success',
      language === 'bs' ? 'Dodano u korpu' : 'Added to cart',
      `${quantity}x ${language === 'bs' ? item.name : item.nameEn} (${item.price.toFixed(2)} KM)`
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.cartItemId !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.cartItemId === cartItemId) {
            const newQty = ci.quantity + delta;
            if (newQty <= 0) return null;
            const newLineTotal = (Math.round(ci.itemPrice * 100) * newQty) / 100;
            return { ...ci, quantity: newQty, lineTotal: newLineTotal };
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null)
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Promo code
  const applyPromoCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const promo = promotions.find((p) => p.code.toUpperCase() === cleanCode);

    if (!promo) {
      return {
        success: false,
        message: language === 'bs' ? 'Nevažeći promotivni kod.' : 'Invalid coupon code.',
      };
    }

    if (!promo.isActive) {
      return {
        success: false,
        message: language === 'bs' ? 'Ovaj kod više nije aktivan.' : 'This coupon has expired.',
      };
    }

    const currentSubtotal = calculateCartSubtotal(cart);
    if (promo.minOrderAmount && currentSubtotal < promo.minOrderAmount) {
      return {
        success: false,
        message:
          language === 'bs'
            ? `Minimalan iznos narudžbe za ovaj kod je ${promo.minOrderAmount.toFixed(2)} KM.`
            : `Minimum order for this coupon is ${promo.minOrderAmount.toFixed(2)} KM.`,
      };
    }

    setAppliedPromo(promo);
    return {
      success: true,
      message:
        language === 'bs'
          ? `Kupon ${promo.code} uspješno primijenjen!`
          : `Promo code ${promo.code} applied!`,
    };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Calculations
  const cartSubtotal = calculateCartSubtotal(cart);
  const deliveryFee = calculateDeliveryFee(cartSubtotal, settings, 'delivery');
  const discountResult = validateAndApplyDiscount(cartSubtotal, appliedPromo);
  const discountAmount = discountResult.discountAmount;
  const cartTotal = calculateOrderTotal(cartSubtotal, deliveryFee, discountAmount);
  const finalTotal = cartTotal;

  // Orders
  const submitOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<Order> => {
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      orderNumber,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    // Save locally
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist to Firestore lazily
    await saveOrderToFirestore(newOrder);

    addToast(
      'success',
      language === 'bs' ? 'Narudžba uspješno zaprimljena!' : 'Order Placed Successfully!',
      language === 'bs' ? `Broj narudžbe: ${orderNumber}` : `Order Number: ${orderNumber}`
    );

    return newOrder;
  };

  const createOrder = submitOrder;

  const updateOrderStatus = async (orderNumber: string, newStatus: OrderStatus, notes?: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber === orderNumber) {
          const updated = {
            ...ord,
            status: newStatus,
            internalNotes: notes !== undefined ? notes : ord.internalNotes,
            updatedAt: now,
          };
          saveOrderToFirestore(updated);
          return updated;
        }
        return ord;
      })
    );
  };

  const getOrder = (orderNumber: string) => {
    return orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());
  };

  // Reservations
  const createReservation = async (
    resData: Omit<Reservation, 'reservationNumber' | 'status' | 'createdAt' | 'updatedAt'>
  ): Promise<Reservation> => {
    const reservationNumber = generateReservationNumber();
    const now = new Date().toISOString();

    const newReservation: Reservation = {
      ...resData,
      id: `res-${Date.now()}`,
      reservationNumber,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    setReservations((prev) => [newReservation, ...prev]);

    // Persist to Firestore lazily
    await saveReservationToFirestore(newReservation);

    addToast(
      'success',
      language === 'bs' ? 'Zahtjev za rezervaciju poslan' : 'Reservation Request Submitted',
      language === 'bs'
        ? `Vaš kod rezervacije je ${reservationNumber}. Uskoro ćete primiti potvrdu.`
        : `Your reservation code is ${reservationNumber}. You will receive confirmation shortly.`
    );

    return newReservation;
  };

  const updateReservationStatus = async (
    reservationNumber: string,
    status: ReservationStatus,
    internalNotes?: string
  ) => {
    const now = new Date().toISOString();
    setReservations((prev) =>
      prev.map((r) => {
        if (r.reservationNumber === reservationNumber) {
          const updated = {
            ...r,
            status,
            internalNotes: internalNotes !== undefined ? internalNotes : r.internalNotes,
            updatedAt: now,
          };
          saveReservationToFirestore(updated);
          return updated;
        }
        return r;
      })
    );
  };

  // Event Inquiries
  const submitEventInquiry = async (inquiry: Omit<EventInquiry, 'status' | 'createdAt'>) => {
    const now = new Date().toISOString();
    const newInquiry: EventInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      status: 'new',
      createdAt: now,
    };
    setEventInquiries((prev) => [newInquiry, ...prev]);

    await saveEventInquiryToFirestore(newInquiry);

    addToast(
      'success',
      language === 'bs' ? 'Upit za događaj poslan' : 'Event Inquiry Sent',
      language === 'bs' ? 'Naš event tim će vas kontaktirati unutar 24h.' : 'Our dining manager will reach out within 24h.'
    );
  };

  // Newsletter
  const subscribeNewsletter = async (email: string) => {
    if (!email || !email.includes('@')) {
      return { success: false, message: language === 'bs' ? 'Molimo unesite ispravan email' : 'Please provide a valid email' };
    }
    await saveNewsletterSubscription(email);

    return {
      success: true,
      message: language === 'bs' ? 'Hvala vam! Uspješno ste prijavljeni na naš newsletter.' : 'Thank you! You have subscribed to our newsletter.',
    };
  };

  // Admin menu management
  const updateMenuItem = async (item: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    await saveMenuItemToFirestore(item);
    addToast('success', 'Meni ažuriran', `Jelo "${item.name}" je uspješno spremljeno.`);
  };

  const addMenuItem = async (itemData: Omit<MenuItem, 'id'>) => {
    const id = `item-${Date.now()}`;
    const newItem: MenuItem = { ...itemData, id };
    setMenuItems((prev) => [...prev, newItem]);
    await saveMenuItemToFirestore(newItem);
    addToast('success', 'Novo jelo kreirano', `"${newItem.name}" je dodano na meni.`);
  };

  const deleteMenuItem = async (itemId: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));
    await deleteMenuItemFromFirestore(itemId);
    addToast('info', 'Jelo uklonjeno', 'Jelo je izbrisano sa menija.');
  };

  const toggleItemAvailability = async (itemId: string) => {
    const item = menuItems.find((m) => m.id === itemId);
    if (!item) return;
    const updated = { ...item, isAvailable: !item.isAvailable };
    await updateMenuItem(updated);
  };

  // Admin settings update
  const updateSettings = async (newSettings: Partial<RestaurantSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    await saveSettingsToFirestore(merged);
    addToast('success', 'Postavke sačuvane', 'Postavke restorana su uspješno ažurirane.');
  };

  return (
    <RestaurantContext.Provider
      value={{
        language,
        setLanguage,
        settings,
        updateSettings,
        categories,
        menuItems,
        updateMenuItem,
        addMenuItem,
        deleteMenuItem,
        toggleItemAvailability,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        deliveryFee,
        discountAmount,
        cartTotal,
        finalTotal,
        promotions,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        orders,
        submitOrder,
        createOrder,
        updateOrderStatus,
        getOrder,
        reservations,
        createReservation,
        updateReservationStatus,
        eventInquiries,
        submitEventInquiry,
        subscribeNewsletter,
        activeTableId,
        setActiveTableId,
        isCartOpen,
        setIsCartOpen,
        selectedDish,
        setSelectedDish,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within a RestaurantProvider');
  }
  return context;
};
