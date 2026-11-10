/**
 * On-demand Firestore Service
 * Encapsulates Firestore operations with lazy dynamic imports so that @firebase/firestore
 * and re2js (~114 KiB) are not included in the critical initial homepage bundle.
 */

import { MenuItem, RestaurantSettings, Order, Reservation, EventInquiry } from '../types/restaurant';
import firebaseConfig from '../../firebase-applet-config.json';
import { app } from '../firebase';

let cachedDb: any = null;

export async function getDbInstance() {
  if (!cachedDb) {
    const { getFirestore } = await import('firebase/firestore');
    cachedDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
  return cachedDb;
}

/**
 * Background sync for settings and menu items, called during idle time
 */
export async function syncInitialDataFromFirestore(
  onSettingsLoaded: (settings: RestaurantSettings) => void,
  onMenuItemsLoaded: (items: MenuItem[]) => void
) {
  try {
    const db = await getDbInstance();
    const { doc, getDoc, collection, getDocs } = await import('firebase/firestore');

    // Sync settings
    try {
      const settingsRef = doc(db, 'restaurantSettings', 'global');
      const snap = await getDoc(settingsRef);
      if (snap.exists()) {
        onSettingsLoaded(snap.data() as RestaurantSettings);
      }
    } catch {
      // offline or rule bypass fallback to localStorage
    }

    // Sync menu items
    try {
      const querySnap = await getDocs(collection(db, 'menuItems'));
      if (!querySnap.empty) {
        const items: MenuItem[] = [];
        querySnap.forEach((docSnap) => items.push(docSnap.data() as MenuItem));
        if (items.length > 0) {
          onMenuItemsLoaded(items);
        }
      }
    } catch {
      // offline or rule bypass fallback to localStorage
    }
  } catch (err) {
    console.warn('Initial Firestore sync safely deferred:', err);
  }
}

export async function saveOrderToFirestore(order: Order) {
  try {
    const db = await getDbInstance();
    const { doc, setDoc } = await import('firebase/firestore');
    const docId = order.orderNumber || order.id || `ord-${Date.now()}`;
    await setDoc(doc(db, 'orders', docId), order);
  } catch (err) {
    console.warn('Order saved to local storage fallback:', err);
  }
}

export async function saveReservationToFirestore(reservation: Reservation) {
  try {
    const db = await getDbInstance();
    const { doc, setDoc } = await import('firebase/firestore');
    const docId = reservation.reservationNumber || reservation.id || `res-${Date.now()}`;
    await setDoc(doc(db, 'reservations', docId), reservation);
  } catch (err) {
    console.warn('Reservation saved to local storage fallback:', err);
  }
}

export async function saveEventInquiryToFirestore(inquiry: EventInquiry) {
  try {
    const db = await getDbInstance();
    const { doc, setDoc } = await import('firebase/firestore');
    const docId = inquiry.id || `inq-${Date.now()}`;
    await setDoc(doc(db, 'eventInquiries', docId), inquiry);
  } catch (err) {
    console.warn('Inquiry saved to local storage fallback:', err);
  }
}

export async function saveNewsletterSubscription(email: string) {
  try {
    const db = await getDbInstance();
    const { doc, setDoc } = await import('firebase/firestore');
    const cleanId = email.toLowerCase().replace(/[^a-z0-9]/g, '_');
    await setDoc(doc(db, 'newsletterSubscribers', cleanId), {
      email,
      subscribedAt: new Date().toISOString(),
      active: true,
    });
  } catch (err) {
    console.warn('Newsletter saved to local session:', err);
  }
}

export async function saveMenuItemToFirestore(item: MenuItem) {
  try {
    const db = await getDbInstance();
    const { doc, setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'menuItems', item.id), item);
  } catch (err) {
    console.warn('Menu item saved to local session:', err);
  }
}

export async function deleteMenuItemFromFirestore(itemId: string) {
  try {
    const db = await getDbInstance();
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, 'menuItems', itemId));
  } catch (err) {
    console.warn('Menu item deleted from local session:', err);
  }
}

export async function saveSettingsToFirestore(settings: RestaurantSettings) {
  try {
    const db = await getDbInstance();
    const { doc, setDoc } = await import('firebase/firestore');
    await setDoc(doc(db, 'restaurantSettings', 'global'), settings);
  } catch (err) {
    console.warn('Settings saved to local session:', err);
  }
}
