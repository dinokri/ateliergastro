/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
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
import { DishDetailModal } from './components/menu/DishDetailModal';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderTrackingView } from './components/tracking/OrderTrackingView';
import { ReservationPage } from './components/reservations/ReservationPage';
import { AboutPage } from './components/about/AboutPage';
import { GalleryPage } from './components/gallery/GalleryPage';
import { PrivateDiningPage } from './components/events/PrivateDiningPage';
import { ContactPage } from './components/contact/ContactPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { QRMenuModal } from './components/qr/QRMenuModal';
import { LegalModal } from './components/legal/LegalModal';

function MainApp() {
  const { selectedDish, setSelectedDish, setIsCartOpen } = useRestaurant();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [lastOrderNumber, setLastOrderNumber] = useState<string>('');
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<
    'privacy' | 'cookies' | 'terms' | 'allergens' | 'delivery' | null
  >(null);

  // Google Maps Platform Quota Banner State
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
    <div className="min-h-screen bg-[#F7F4ED] text-[#20221F] flex flex-col antialiased selection:bg-[#B66F52] selection:text-white">
      
      {/* Google Maps Quota Defense Banner */}
      {quotaReached && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
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

      {/* Main Content Router */}
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
      </main>

      {/* Modals & Overlays */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
      />

      <CartDrawer
        onProceedToCheckout={() => setCurrentTab('checkout')}
      />

      <QRMenuModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
      />

      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
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
    <AuthProvider>
      <RestaurantProvider>
        <MainApp />
      </RestaurantProvider>
    </AuthProvider>
  );
}
