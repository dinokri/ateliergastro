/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { StickyMobileNav } from './components/common/StickyMobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { Hero } from './components/home/Hero';
import { FeaturedDishes } from './components/home/FeaturedDishes';
import { AtmosphereSection } from './components/home/AtmosphereSection';
import { ReviewsSection } from './components/home/ReviewsSection';
import { MapLocationSection } from './components/home/MapLocationSection';
import { DigitalMenu } from './components/menu/DigitalMenu';
import { CartDrawer } from './components/cart/CartDrawer';

// Code-split secondary routes and heavy modals to eliminate unused initial JavaScript
const CheckoutPage = lazy(() =>
  import('./components/checkout/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
);
const OrderTrackingView = lazy(() =>
  import('./components/tracking/OrderTrackingView').then((m) => ({ default: m.OrderTrackingView }))
);
const ReservationPage = lazy(() =>
  import('./components/reservations/ReservationPage').then((m) => ({ default: m.ReservationPage }))
);
const AboutPage = lazy(() =>
  import('./components/about/AboutPage').then((m) => ({ default: m.AboutPage }))
);
const GalleryPage = lazy(() =>
  import('./components/gallery/GalleryPage').then((m) => ({ default: m.GalleryPage }))
);
const PrivateDiningPage = lazy(() =>
  import('./components/events/PrivateDiningPage').then((m) => ({ default: m.PrivateDiningPage }))
);
const ContactPage = lazy(() =>
  import('./components/contact/ContactPage').then((m) => ({ default: m.ContactPage }))
);
const AdminDashboard = lazy(() =>
  import('./components/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard }))
);
const DishDetailModal = lazy(() =>
  import('./components/menu/DishDetailModal').then((m) => ({ default: m.DishDetailModal }))
);
const QRMenuModal = lazy(() =>
  import('./components/qr/QRMenuModal').then((m) => ({ default: m.QRMenuModal }))
);
const LegalModal = lazy(() =>
  import('./components/legal/LegalModal').then((m) => ({ default: m.LegalModal }))
);

const PageLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center" aria-live="polite" aria-busy="true">
    <div className="w-10 h-10 rounded-full border-3 border-[#C5A059]/30 border-t-[#C5A059] animate-spin mb-3" />
    <span className="text-xs uppercase tracking-widest text-[#121417]/70 font-medium">Učitavanje...</span>
  </div>
);

function MainApp() {
  const { selectedDish, setSelectedDish } = useRestaurant();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [lastOrderNumber, setLastOrderNumber] = useState<string>('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<
    'privacy' | 'cookies' | 'terms' | 'allergens' | 'delivery' | null
  >(null);

  // Google Maps Platform Quota Defense State
  const [quotaReached, setQuotaReached] = useState(false);

  useEffect(() => {
    const handler = () => setQuotaReached(true);
    window.addEventListener('gmp-quota-exceeded', handler);
    return () => window.removeEventListener('gmp-quota-exceeded', handler);
  }, []);

  // Check URL query parameters for direct routing (e.g. ?view=admin or ?view=menu or ?order=AB-2026-XXXX)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const order = params.get('order');

      if (view) {
        setCurrentTab(view);
      } else if (order) {
        setLastOrderNumber(order);
        setCurrentTab('tracking');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleOrderCompleted = (orderNumber: string) => {
    setLastOrderNumber(orderNumber);
    setCurrentTab('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121417] flex flex-col antialiased selection:bg-[#C5A059] selection:text-white">
      
      {/* Google Maps Quota Defense Banner */}
      {quotaReached && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm" role="status">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* Header Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openQRModal={() => setIsQRModalOpen(true)}
      />

      {/* Main Content Router with Suspense for Lazy Subpages */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            <Hero setCurrentTab={setCurrentTab} />
            <FeaturedDishes setCurrentTab={setCurrentTab} />
            <AtmosphereSection setCurrentTab={setCurrentTab} />
            <ReviewsSection />
            <MapLocationSection />
          </div>
        )}

        {currentTab === 'menu' && <DigitalMenu />}

        {currentTab === 'order' && (
          <div>
            <DigitalMenu />
          </div>
        )}

        <Suspense fallback={<PageLoadingFallback />}>
          {currentTab === 'checkout' && (
            <CheckoutPage
              onBackToMenu={() => setCurrentTab('menu')}
              onOrderCompleted={handleOrderCompleted}
            />
          )}

          {currentTab === 'tracking' && (
            <OrderTrackingView
              initialOrderNumber={lastOrderNumber}
              onBackToHome={() => setCurrentTab('home')}
            />
          )}

          {currentTab === 'reservations' && <ReservationPage />}

          {currentTab === 'about' && <AboutPage setCurrentTab={setCurrentTab} />}

          {currentTab === 'gallery' && <GalleryPage />}

          {currentTab === 'events' && <PrivateDiningPage />}

          {currentTab === 'contact' && <ContactPage />}

          {currentTab === 'admin' && <AdminDashboard />}
        </Suspense>
      </main>

      {/* Modals & Overlays loaded on demand */}
      <Suspense fallback={null}>
        {selectedDish && (
          <DishDetailModal
            dish={selectedDish}
            onClose={() => setSelectedDish(null)}
          />
        )}

        {isQRModalOpen && (
          <QRMenuModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
          />
        )}

        {legalModalType && (
          <LegalModal
            type={legalModalType}
            onClose={() => setLegalModalType(null)}
          />
        )}
      </Suspense>

      {/* Persistent Shopping Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setCurrentTab('checkout')}
      />

      {/* Sticky Mobile Nav on Smartphones */}
      <StickyMobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Footer */}
      <Footer
        setCurrentTab={setCurrentTab}
        openLegalModal={(type) => setLegalModalType(type)}
      />

      {/* Toast Alert System */}
      <ToastContainer />

    </div>
  );
}

export default function App() {
  return (
    <RestaurantProvider>
      <MainApp />
    </RestaurantProvider>
  );
}
