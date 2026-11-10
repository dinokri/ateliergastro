import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  CartItem,
  Language,
  MenuCategory,
  MenuItem,
  Order,
  OrderStatus,
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
  calculateCartSubtotal,
  calculateDeliveryFee,
  calculateOrderTotal,
  generateOrderNumber,
  generateReservationNumber,
  validateAndApplyDiscount,
} from '../utils/pricing';
import { db } from '../firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';

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
    extrasIds?: string[],
    instructions?: string
  ) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  appliedPromo: Promotion | null;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  cartSubtotal: number;
  deliveryFee: number;
  discountAmount: number;
  cartTotal: number;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Order>;
  updateOrderStatus: (orderNumber: string, newStatus: OrderStatus, notes?: string) => Promise<void>;
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

  // Firestore background synchronization when available
  useEffect(() => {
    let unsubOrders: (() => void) | undefined;
    let unsubReservations: (() => void) | undefined;

    try {
      // Sync settings from Firestore if present
      const settingsRef = doc(db, 'restaurantSettings', 'global');
      getDoc(settingsRef).then((snap) => {
        if (snap.exists()) {
          setSettings(snap.data() as RestaurantSettings);
        }
      }).catch(() => {
        // use local
      });

      // Sync menu items from Firestore if present
      getDocs(collection(db, 'menuItems')).then((querySnap) => {
        if (!querySnap.empty) {
          const items: MenuItem[] = [];
          querySnap.forEach((docSnap) => items.push(docSnap.data() as MenuItem));
          if (items.length > 0) {
            setMenuItems(items);
          }
        }
      }).catch(() => {
        // use local
      });
    } catch (e) {
      console.warn('Initial Firestore sync skipped:', e);
    }

    return () => {
      unsubOrders?.();
      unsubReservations?.();
    };
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
    extrasIds: string[] = [],
    instructions?: string
  ) => {
    if (!item.isAvailable) {
      addToast(
        'error',
        language === 'bs' ? 'Artikal nedostupan' : 'Item unavailable',
        language === 'bs' ? 'Ovo jelo trenutno nije na raspolaganju.' : 'This dish is currently out of stock.'
      );
      return;
    }

    const selectedVariant = item.variants?.find((v) => v.id === variantId);
    const selectedExtras = (item.extras || []).filter((e) => extrasIds.includes(e.id));

    // Calculate base unit price with variants and extras
    const baseCents = Math.round(item.price * 100);
    const variantCents = selectedVariant ? Math.round(selectedVariant.priceDelta * 100) : 0;
    const extrasCents = selectedExtras.reduce((sum, e) => sum + Math.round(e.price * 100), 0);
    const itemPrice = (baseCents + variantCents + extrasCents) / 100;

    const cartItemId = `${item.id}_${variantId || 'base'}_${extrasIds.sort().join('-')}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((c) => c.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = existing.quantity + quantity;
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          lineTotal: (Math.round(itemPrice * 100) * newQty) / 100,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          menuItem: item,
          quantity,
          selectedVariant,
          selectedExtras,
          specialInstructions: instructions,
          itemPrice,
          lineTotal: (Math.round(itemPrice * 100) * quantity) / 100,
        };
        return [...prev, newItem];
      }
    });

    addToast(
      'success',
      language === 'bs' ? 'Dodano u korpu' : 'Added to cart',
      `${quantity}x ${language === 'bs' ? item.name : item.nameEn} (${itemPrice.toFixed(2)} KM)`
    );
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              lineTotal: (Math.round(item.itemPrice * 100) * newQty) / 100,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Calculations
  const cartSubtotal = calculateCartSubtotal(cart);
  const deliveryFee = calculateDeliveryFee(cartSubtotal, settings, 'delivery');
  const promoValidation = validateAndApplyDiscount(cartSubtotal, appliedPromo);
  const discountAmount = promoValidation.isValid ? promoValidation.discountAmount : 0;
  const cartTotal = calculateOrderTotal(cartSubtotal, deliveryFee, discountAmount);

  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    const promo = promotions.find((p) => p.code.toUpperCase() === clean);
    if (!promo) {
      return {
        success: false,
        message: language === 'bs' ? 'Kupon kod nije pronađen' : 'Promotion code not found',
      };
    }
    const val = validateAndApplyDiscount(cartSubtotal, promo);
    if (val.isValid) {
      setAppliedPromo(promo);
      return { success: true, message: val.message };
    }
    return { success: false, message: val.message };
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Orders
  const createOrder = async (orderData: Omit<Order, 'orderNumber' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Order> => {
    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const newOrder: Order = {
      ...orderData,
      orderNumber,
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    // Save locally
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist to Firestore
    try {
      const orderDocRef = doc(db, 'orders', orderNumber);
      await setDoc(orderDocRef, newOrder);
    } catch (err) {
      console.warn('Saved order locally (Firestore offline/background sync):', err);
    }

    addToast(
      'success',
      language === 'bs' ? 'Narudžba uspješno zaprimljena!' : 'Order Placed Successfully!',
      language === 'bs' ? `Broj narudžbe: ${orderNumber}` : `Order Number: ${orderNumber}`
    );

    return newOrder;
  };

  const updateOrderStatus = async (orderNumber: string, newStatus: OrderStatus, notes?: string) => {
    const now = new Date().toISOString();
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.orderNumber === orderNumber) {
          return {
            ...ord,
            status: newStatus,
            internalNotes: notes !== undefined ? notes : ord.internalNotes,
            updatedAt: now,
          };
        }
        return ord;
      })
    );

    try {
      const orderDocRef = doc(db, 'orders', orderNumber);
      await updateDoc(orderDocRef, {
        status: newStatus,
        ...(notes !== undefined ? { internalNotes: notes } : {}),
        updatedAt: now,
      });
    } catch (e) {
      console.warn('Status updated locally:', e);
    }
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
      reservationNumber,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    setReservations((prev) => [newReservation, ...prev]);

    try {
      const resDocRef = doc(db, 'reservations', reservationNumber);
      await setDoc(resDocRef, newReservation);
    } catch (e) {
      console.warn('Saved reservation locally:', e);
    }

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
          return {
            ...r,
            status,
            internalNotes: internalNotes !== undefined ? internalNotes : r.internalNotes,
            updatedAt: now,
          };
        }
        return r;
      })
    );

    try {
      const resDocRef = doc(db, 'reservations', reservationNumber);
      await updateDoc(resDocRef, {
        status,
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        updatedAt: now,
      });
    } catch (e) {
      console.warn('Reservation updated locally:', e);
    }
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

    try {
      const docRef = doc(db, 'eventInquiries', newInquiry.id!);
      await setDoc(docRef, newInquiry);
    } catch (e) {
      console.warn('Saved inquiry locally:', e);
    }

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
    const cleanId = email.replace(/[^a-zA-Z0-9]/g, '_');
    const now = new Date().toISOString();

    try {
      await setDoc(doc(db, 'newsletterSubscribers', cleanId), {
        email,
        subscribedAt: now,
        consentGiven: true,
      });
    } catch {
      // local log
    }

    return {
      success: true,
      message: language === 'bs' ? 'Hvala vam! Uspješno ste prijavljeni na naš newsletter.' : 'Thank you! You have subscribed to our newsletter.',
    };
  };

  // Admin menu management
  const updateMenuItem = async (item: MenuItem) => {
    setMenuItems((prev) => prev.map((m) => (m.id === item.id ? item : m)));
    try {
      await setDoc(doc(db, 'menuItems', item.id), item);
    } catch (e) {
      console.warn('Item updated locally:', e);
    }
    addToast('success', 'Meni ažuriran', `Jelo "${item.name}" je uspješno spremljeno.`);
  };

  const addMenuItem = async (itemData: Omit<MenuItem, 'id'>) => {
    const id = `item-${Date.now()}`;
    const newItem: MenuItem = { ...itemData, id };
    setMenuItems((prev) => [...prev, newItem]);
    try {
      await setDoc(doc(db, 'menuItems', id), newItem);
    } catch (e) {
      console.warn('Item added locally:', e);
    }
    addToast('success', 'Novo jelo kreirano', `"${newItem.name}" je dodano na meni.`);
  };

  const deleteMenuItem = async (itemId: string) => {
    setMenuItems((prev) => prev.filter((m) => m.id !== itemId));
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
    try {
      await setDoc(doc(db, 'restaurantSettings', 'global'), merged);
    } catch (e) {
      console.warn('Settings updated locally:', e);
    }
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
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedPromo,
        applyPromoCode,
        removePromoCode,
        cartSubtotal,
        deliveryFee,
        discountAmount,
        cartTotal,
        orders,
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
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
};
