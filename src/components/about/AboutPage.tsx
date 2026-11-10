import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Award, Compass, Heart, Users, Sparkles, ChefHat } from 'lucide-react';

interface AboutPageProps {
  setCurrentTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ setCurrentTab }) => {
  const { language, settings } = useRestaurant();

  const team = [
    {
      name: 'Adnan Velić',
      roleBs: 'Glavni Šef Kuhinje (Executive Chef)',
      roleEn: 'Executive Chef',
      bioBs: 'Nakon 15 godina usavršavanja u restoranima sa Michelin zvjezdicama u Lyonu i Firenci, Adnan donosi viziju savremene bosansko-mediteranske kuhinje.',
      bioEn: 'Following 15 years in Michelin-starred establishments in Lyon and Florence, Chef Adnan brings a master vision of modern Mediterranean gastronomy.',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Matea Novak',
      roleBs: 'Glavni Sommelier & Menadžer Vina',
      roleEn: 'Head Sommelier & Cellar Master',
      bioBs: 'WSET Level 3 certificirani sommelier posvećena biodinamičkim vinima, autohtonim hercegovačkim sortama i rijetkim evropskim berbama.',
      bioEn: 'Certified WSET Level 3 sommelier specializing in biodynamic terroirs, indigenous Herzegovinian varietals, and private cellar imports.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    },
    {
      name: 'Kenan Dizdarević',
      roleBs: 'Šef Slastičar (Head Pastry Chef)',
      roleEn: 'Head Pastry Chef',
      bioBs: 'Majstor francuske škole slastičarstva i modernih deserata koji spaja lokalno voće sa vrhunskom Valrhona čokoladom.',
      bioEn: 'Artisan of French haute patisserie combining foraged mountain berries with premier grand cru chocolates.',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="py-12 bg-[#F7F4ED] text-[#20221F] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Hero Intro */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#B66F52] block mb-2">
            Naša Priča &bull; Our Heritage
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#20221F]">
            {language === 'bs' ? 'Umjetnost Gostoprimstva i Okusa' : 'The Art of Taste & Hospitality'}
          </h1>
          <p className="text-xs sm:text-sm text-[#20221F]/70 mt-4 font-light leading-relaxed">
            {language === 'bs'
              ? 'Atelier Bistro osnovan je sa jednostavnom, ali nepokolebljivom vizijom: stvoriti prostor gdje se kulinarska izvrsnost susreće sa toplinom sarajevskog duha.'
              : 'Atelier Bistro was born from a singular, uncompromising vision: to unite world-class culinary craft with genuine warmth.'}
          </p>
        </div>

        {/* Narrative & Visual Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#20221F]">
              {language === 'bs' ? 'Od Sezonskih Farmi do Vašeg Tanjira' : 'From Mountain Farms to the Plate'}
            </h2>
            <p className="text-xs sm:text-sm text-[#20221F]/80 font-light leading-relaxed">
              {language === 'bs'
                ? 'Naš jelovnik se mijenja u skladu sa prirodnim ritmom godišnjih doba. Svako jutro biramo divlju ribu od jadranskih ribara, organsko povrće iz staklenika u dolini Neretve i mirisne planinske trave sa obronaka Bjelašnice.'
                : 'Our menu ebbs and flows with nature’s seasonal calendar. Each morning we handpick wild catch from Dalmatian fishermen, organic produce from the Neretva river valley, and foraged mountain herbs.'}
            </p>
            <p className="text-xs sm:text-sm text-[#20221F]/80 font-light leading-relaxed">
              {language === 'bs'
                ? 'Vjerujemo u poštovanje svake pojedinačne namirnice. Meso odležavamo u posebnim komorama sa himalajskom solju, paste i brioše mijesimo ručno svakoga jutra, a sve temeljce kuhamo minimum 48 sati.'
                : 'We believe in profound respect for the ingredient. We age our cuts over Himalayan salt, shape our pasta and brioche at sunrise, and simmer our reduction sauces for over 48 hours.'}
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setCurrentTab('menu');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-[#59634A] hover:bg-[#3F4734] text-white text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                {language === 'bs' ? 'Pogledajte Naš Meni' : 'View Seasonal Menu'}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80"
                alt="Atelier Bistro Dining Room"
                className="w-full h-[440px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-2xl bg-white border border-[#E9E1D4] shadow-sm">
            <ChefHat className="w-8 h-8 text-[#B66F52] mb-4" />
            <h3 className="font-serif text-xl font-semibold text-[#20221F] mb-2">
              {language === 'bs' ? 'Autorska Gastronomija' : 'Artisanal Gastronomy'}
            </h3>
            <p className="text-xs text-[#20221F]/70 font-light leading-relaxed">
              {language === 'bs'
                ? 'Kombinacija drevnih mediteranskih receptura i savremenih kulinarskih tehnika.'
                : 'Ancient Mediterranean culinary heritage enhanced by modern kitchen precision.'}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#E9E1D4] shadow-sm">
            <Compass className="w-8 h-8 text-[#59634A] mb-4" />
            <h3 className="font-serif text-xl font-semibold text-[#20221F] mb-2">
              {language === 'bs' ? 'Čista Održivost' : 'Traceable Provenance'}
            </h3>
            <p className="text-xs text-[#20221F]/70 font-light leading-relaxed">
              {language === 'bs'
                ? 'Direktna saradnja sa malim lokalnim proizvođačima, pčelarima i ribarima.'
                : 'Direct contracts with small artisanal cheese makers, beekeepers, and coastal fisheries.'}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-[#E9E1D4] shadow-sm">
            <Heart className="w-8 h-8 text-[#B66F52] mb-4" />
            <h3 className="font-serif text-xl font-semibold text-[#20221F] mb-2">
              {language === 'bs' ? 'Gostoprimstvo sa Dušom' : 'Genuine Hospitality'}
            </h3>
            <p className="text-xs text-[#20221F]/70 font-light leading-relaxed">
              {language === 'bs'
                ? 'Posvećena pažnja svakom detalju, od izbora muzike do personalizovanog servisa.'
                : 'Every element—from ambient acoustics to cellar pairings—tailored to our guests.'}
            </p>
          </div>
        </div>

        {/* Culinary Team Section */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#59634A] block mb-2">
              Stručnost &bull; Mastery
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#20221F]">
              {language === 'bs' ? 'Upoznajte Naš Kulinarski Tim' : 'Meet the Culinary Brigade'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-2xl overflow-hidden border border-[#E9E1D4] shadow-sm group hover:shadow-lg transition-all"
              >
                <div className="h-72 w-full overflow-hidden bg-[#E9E1D4]/40">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl font-semibold text-[#20221F] mb-0.5">
                    {member.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#B66F52] block mb-3">
                    {language === 'bs' ? member.roleBs : member.roleEn}
                  </span>
                  <p className="text-xs text-[#20221F]/70 font-light leading-relaxed">
                    {language === 'bs' ? member.bioBs : member.bioEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
