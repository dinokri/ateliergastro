import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Utensils, ShoppingBag, Calendar, Home, Compass } from 'lucide-react';

interface StickyMobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const StickyMobileNav: React.FC<StickyMobileNavProps> = ({ currentTab, setCurrentTab }) => {
  const { language, cart, setIsCartOpen } = useRestaurant();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems = [
    {
      id: 'home',
      labelBs: 'Početna',
      labelEn: 'Home',
      icon: Home,
      action: () => {
        setCurrentTab('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'menu',
      labelBs: 'Meni',
      labelEn: 'Menu',
      icon: Utensils,
      action: () => {
        setCurrentTab('menu');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    },
    {
      id: 'order',
      labelBs: 'Naruči',
      labelEn: 'Order',
      icon: ShoppingBag,
      action: () => {
        setCurrentTab('order');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      badge: totalCartCount > 0 ? totalCartCount : undefined,
    },
    {
      id: 'reservations',
      labelBs: 'Rezerviši',
      labelEn: 'Reserve',
      icon: Calendar,
      action: () => {
        setCurrentTab('reservations');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      highlight: true,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#20221F]/95 backdrop-blur-lg border-t border-[#3F4734] px-2 py-1.5 shadow-2xl">
      <div className="grid grid-cols-4 gap-1 items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.highlight) {
            return (
              <button
                key={item.id}
                onClick={item.action}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#B66F52] text-white shadow-md'
                    : 'bg-[#59634A] text-[#F7F4ED] hover:bg-[#3F4734]'
                }`}
                aria-label={language === 'bs' ? item.labelBs : item.labelEn}
              >
                <Icon className="w-4 h-4 mb-0.5" />
                <span className="text-[10px] font-bold tracking-tight uppercase">
                  {language === 'bs' ? item.labelBs : item.labelEn}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-colors ${
                isActive ? 'text-[#B66F52] font-semibold' : 'text-[#E9E1D4]/80 hover:text-white'
              }`}
              aria-label={language === 'bs' ? item.labelBs : item.labelEn}
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#B66F52] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#20221F]">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">
                {language === 'bs' ? item.labelBs : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
