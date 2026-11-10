import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ShoppingBag, 
  Menu as MenuIcon, 
  X, 
  Globe, 
  CalendarDays, 
  UtensilsCrossed, 
  ShieldCheck, 
  QrCode,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openQRModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab, openQRModal }) => {
  const { language, setLanguage, cart, setIsCartOpen, activeTableId, settings } = useRestaurant();
  const { isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', labelBs: 'Početna', labelEn: 'Home' },
    { id: 'menu', labelBs: 'Digitalni Meni', labelEn: 'Menu' },
    { id: 'order', labelBs: 'Naruči Online', labelEn: 'Order Online' },
    { id: 'reservations', labelBs: 'Rezervacije', labelEn: 'Reservations' },
    { id: 'about', labelBs: 'O Nama', labelEn: 'About Us' },
    { id: 'gallery', labelBs: 'Galerija', labelEn: 'Gallery' },
    { id: 'events', labelBs: 'Privatni Događaji', labelEn: 'Events & Catering' },
    { id: 'contact', labelBs: 'Kontakt', labelEn: 'Contact' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F4ED]/95 backdrop-blur-md border-b border-[#E9E1D4] transition-all">
      {/* Announcement Bar if table QR is active */}
      {activeTableId && (
        <div className="bg-[#59634A] text-[#F7F4ED] px-4 py-1.5 text-xs text-center flex items-center justify-center gap-2 font-medium">
          <QrCode className="w-3.5 h-3.5 text-[#E9E1D4]" />
          <span>
            {language === 'bs' 
              ? `Naručujete za stolom: ${activeTableId}. Narudžba stiže direktno na vaš sto.` 
              : `Ordering at table: ${activeTableId}. Items will be served directly to you.`}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex flex-col items-start text-left group focus:outline-none"
            aria-label="Atelier Bistro Početna"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-widest font-semibold text-[#20221F] group-hover:text-[#B66F52] transition-colors uppercase">
              {settings.name}
            </span>
            <span className="text-[10px] tracking-[0.28em] text-[#3F4734] font-medium uppercase -mt-1">
              Sarajevo &bull; Haute Cuisine
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-2 rounded-lg text-xs xl:text-sm font-medium tracking-wide transition-all ${
                  currentTab === link.id
                    ? 'text-[#96472C] font-semibold bg-[#E9E1D4]/60'
                    : 'text-[#20221F]/85 hover:text-[#20221F] hover:bg-[#E9E1D4]/30'
                }`}
              >
                {language === 'bs' ? link.labelBs : link.labelEn}
              </button>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'bs' ? 'en' : 'bs')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#20221F] hover:bg-[#E9E1D4] border border-[#E9E1D4] transition-colors"
              title={language === 'bs' ? 'Switch to English' : 'Prebaci na Bosanski'}
              aria-label="Izbor jezika / Language selector"
            >
              <Globe className="w-3.5 h-3.5 text-[#59634A]" />
              <span className="font-semibold">{language.toUpperCase()}</span>
            </button>

            {/* Table QR Code Generator trigger */}
            <button
              onClick={openQRModal}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#20221F] hover:bg-[#E9E1D4] border border-[#E9E1D4] transition-colors"
              title="Table QR Code Generator"
              aria-label="Generiši QR kod za stolove"
            >
              <QrCode className="w-3.5 h-3.5 text-[#59634A]" />
              <span className="hidden xl:inline">QR Meni</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-[#20221F] text-[#F7F4ED] hover:bg-[#B66F52] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#B66F52]"
              aria-label={`Pregled korpe, ukupno ${totalCartCount} artikala`}
            >
              <ShoppingBag className="w-4 h-4" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#B66F52] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#F7F4ED] animate-pulse">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Reserve Table CTA */}
            <button
              onClick={() => handleNavClick('reservations')}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#59634A] text-white hover:bg-[#3F4734] text-xs font-semibold tracking-wider uppercase transition-all shadow-sm hover:shadow"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>{language === 'bs' ? 'Rezerviši Sto' : 'Book a Table'}</span>
            </button>

            {/* Admin Dashboard shortcut */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-xl text-xs font-medium border transition-colors flex items-center gap-1 ${
                currentTab === 'admin'
                  ? 'bg-[#B66F52] text-white border-[#B66F52]'
                  : 'text-[#59634A] border-[#59634A]/30 hover:bg-[#E9E1D4]'
              }`}
              title="Administratorska kontrolna tabla"
              aria-label="Otvori administraciju restorana"
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden xl:inline font-semibold">Admin</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#20221F] hover:bg-[#E9E1D4] focus:outline-none"
              aria-label="Otvori navigacijski meni"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F7F4ED] border-b border-[#E9E1D4] px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  currentTab === link.id
                    ? 'bg-[#59634A] text-white font-semibold'
                    : 'text-[#20221F] hover:bg-[#E9E1D4]/60'
                }`}
              >
                {language === 'bs' ? link.labelBs : link.labelEn}
              </button>
            ))}

            <div className="pt-4 border-t border-[#E9E1D4] flex flex-col gap-2.5">
              <button
                onClick={() => handleNavClick('reservations')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#B66F52] text-white text-sm font-semibold tracking-wider uppercase shadow"
              >
                <CalendarDays className="w-4 h-4" />
                <span>{language === 'bs' ? 'Rezerviši Sto' : 'Book a Table'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openQRModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#59634A] text-[#59634A] text-xs font-semibold"
              >
                <QrCode className="w-4 h-4" />
                <span>{language === 'bs' ? 'QR Kodovi za Stolove' : 'Table QR Code Generator'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
