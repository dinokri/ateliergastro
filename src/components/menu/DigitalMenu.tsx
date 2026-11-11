import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { DietaryTag, MenuItem } from '../../types/restaurant';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Sparkles, 
  Flame, 
  AlertCircle, 
  Clock, 
  Check, 
  X,
  SlidersHorizontal 
} from 'lucide-react';

export const DigitalMenu: React.FC = () => {
  const { language, categories, menuItems, addToCart, setSelectedDish } = useRestaurant();

  const [activeType, setActiveType] = useState<'all' | 'food' | 'drinks'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietary, setSelectedDietary] = useState<DietaryTag[]>([]);
  const [sortBy, setSortBy] = useState<'recommended' | 'price_asc' | 'price_desc' | 'name'>('recommended');

  const dietaryOptions: { tag: DietaryTag; labelBs: string; labelEn: string }[] = [
    { tag: 'vegetarian', labelBs: 'Vegetarijansko', labelEn: 'Vegetarian' },
    { tag: 'vegan', labelBs: 'Vegansko', labelEn: 'Vegan' },
    { tag: 'gluten-free', labelBs: 'Bez Glutena', labelEn: 'Gluten-Free' },
    { tag: 'dairy-free', labelBs: 'Bez Laktoze', labelEn: 'Dairy-Free' },
    { tag: 'spicy', labelBs: 'Ljutkasto', labelEn: 'Spicy' },
    { tag: 'nut-free', labelBs: 'Bez Orašastih', labelEn: 'Nut-Free' },
  ];

  const toggleDietaryFilter = (tag: DietaryTag) => {
    setSelectedDietary((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredCategories = useMemo(() => {
    if (activeType === 'all') return categories.filter((c) => c.isVisible);
    return categories.filter((c) => c.isVisible && c.type === activeType);
  }, [categories, activeType]);

  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    // Filter by type
    if (activeType !== 'all') {
      const catIds = categories.filter((c) => c.type === activeType).map((c) => c.id);
      result = result.filter((item) => catIds.includes(item.categoryId));
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((item) => item.categoryId === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.nameEn.toLowerCase().includes(q) ||
          item.shortDescription.toLowerCase().includes(q) ||
          item.ingredients.toLowerCase().includes(q)
      );
    }

    // Dietary filters (must match all selected tags)
    if (selectedDietary.length > 0) {
      result = result.filter((item) =>
        selectedDietary.every((tag) => item.dietaryTags.includes(tag))
      );
    }

    // Sorting
    if (sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name') {
      result.sort((a, b) =>
        (language === 'bs' ? a.name : a.nameEn).localeCompare(
          language === 'bs' ? b.name : b.nameEn
        )
      );
    } else {
      // Recommended first (Chef rec + Bestsellers first)
      result.sort((a, b) => {
        const scoreA = (a.isChefRecommendation ? 2 : 0) + (a.isBestseller ? 1 : 0);
        const scoreB = (b.isChefRecommendation ? 2 : 0) + (b.isBestseller ? 1 : 0);
        return scoreB - scoreA;
      });
    }

    return result;
  }, [menuItems, activeType, selectedCategory, searchQuery, selectedDietary, sortBy, categories, language]);

  return (
    <div className="py-12 bg-[#FAF8F5] text-[#121417] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Breadcrumb */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-[0.25em] font-bold text-[#8E723B] block mb-2">
            Haute Cuisine &bull; Sarajevo
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#121417]">
            {language === 'bs' ? 'Digitalni Meni' : 'A la Carte Digital Menu'}
          </h1>
          <p className="text-xs sm:text-sm text-[#121417]/70 mt-3 font-light leading-relaxed">
            {language === 'bs'
              ? 'Istražite naša jela pripremljena od svježih lokalnih i jadranskih namirnica. Cijene su izražene u konvertibilnim markama (BAM / KM).'
              : 'Explore our artisanal culinary selections. All ingredients are locally sourced with sustainable Adriatic seafood.'}
          </p>
        </div>

        {/* Top Filter Bar: Type (Food vs Drinks), Search, Sort */}
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E8E2D6] shadow-[0_4px_24px_rgba(18,20,23,0.04)] mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Food vs Drinks Tabs */}
            <div className="flex items-center p-1 bg-[#FAF8F5] rounded-xl border border-[#E8E2D6] w-full md:w-auto">
              <button
                onClick={() => {
                  setActiveType('all');
                  setSelectedCategory('all');
                }}
                className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                  activeType === 'all'
                    ? 'bg-[#121417] text-[#C5A059] shadow-xs font-bold'
                    : 'text-[#121417]/70 hover:text-[#121417]'
                }`}
              >
                {language === 'bs' ? 'Sve (Hrana & Piće)' : 'All Offerings'}
              </button>
              <button
                onClick={() => {
                  setActiveType('food');
                  setSelectedCategory('all');
                }}
                className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                  activeType === 'food'
                    ? 'bg-[#121417] text-[#C5A059] shadow-xs font-bold'
                    : 'text-[#121417]/70 hover:text-[#121417]'
                }`}
              >
                {language === 'bs' ? 'Hrana' : 'Food'}
              </button>
              <button
                onClick={() => {
                  setActiveType('drinks');
                  setSelectedCategory('all');
                }}
                className={`flex-1 md:flex-none px-5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-colors ${
                  activeType === 'drinks'
                    ? 'bg-[#121417] text-[#C5A059] shadow-xs font-bold'
                    : 'text-[#121417]/70 hover:text-[#121417]'
                }`}
              >
                {language === 'bs' ? 'Pića & Vina' : 'Drinks & Wines'}
              </button>
            </div>

            {/* Search Input & Sort dropdown */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'bs' ? 'Pretraži jela, sastojke...' : 'Search dishes, ingredients...'}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-[#FAF8F5]/80 text-[#121417]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    aria-label="Obriši pretragu"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#8E723B] shrink-0 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full sm:w-auto text-xs py-2.5 px-3 rounded-xl border border-[#E8E2D6] focus:outline-none focus:border-[#C5A059] bg-white text-[#121417] font-semibold"
                >
                  <option value="recommended">{language === 'bs' ? 'Preporučeno' : 'Recommended'}</option>
                  <option value="price_asc">{language === 'bs' ? 'Cijena: Manja ka većoj' : 'Price: Low to High'}</option>
                  <option value="price_desc">{language === 'bs' ? 'Cijena: Veća ka manjoj' : 'Price: High to Low'}</option>
                  <option value="name">{language === 'bs' ? 'Naziv (A-Z)' : 'Name (A-Z)'}</option>
                </select>
              </div>
            </div>

          </div>

          {/* Category Tabs Carousel / Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#121417] text-[#C5A059] shadow-xs'
                  : 'bg-[#FAF8F5] text-[#121417]/80 hover:bg-[#EDE7DD] border border-[#E8E2D6]'
              }`}
            >
              {language === 'bs' ? 'Sve Kategorije' : 'All Categories'} ({menuItems.length})
            </button>
            {filteredCategories.map((cat) => {
              const count = menuItems.filter((i) => i.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#121417] text-[#C5A059] shadow-xs border border-[#C5A059]/40'
                      : 'bg-[#FAF8F5] text-[#121417]/80 hover:bg-[#EDE7DD] border border-[#E8E2D6]'
                  }`}
                >
                  {language === 'bs' ? cat.name : cat.nameEn} ({count})
                </button>
              );
            })}
          </div>

          {/* Dietary Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#E8E2D6]/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E723B] mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#C5A059]" />
              <span>{language === 'bs' ? 'Filteri ishrane:' : 'Dietary:'}</span>
            </span>
            {dietaryOptions.map((opt) => {
              const active = selectedDietary.includes(opt.tag);
              return (
                <button
                  key={opt.tag}
                  onClick={() => toggleDietaryFilter(opt.tag)}
                  className={`text-[11px] px-3 py-1 rounded-lg border transition-colors flex items-center gap-1 ${
                    active
                      ? 'bg-[#121417] text-[#C5A059] border-[#C5A059]/60 font-bold shadow-xs'
                      : 'bg-white text-[#121417]/70 border-[#E8E2D6] hover:bg-[#FAF8F5]'
                  }`}
                >
                  {active && <Check className="w-3 h-3 text-[#C5A059]" />}
                  <span>{language === 'bs' ? opt.labelBs : opt.labelEn}</span>
                </button>
              );
            })}

            {selectedDietary.length > 0 && (
              <button
                onClick={() => setSelectedDietary([])}
                className="text-[11px] text-[#9B412D] hover:underline font-bold ml-2"
              >
                {language === 'bs' ? 'Poništi filtere' : 'Clear filters'}
              </button>
            )}
          </div>

        </div>

        {/* Allergy Information Note */}
        <div className="mb-8 p-3 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              {language === 'bs'
                ? 'Imate alergiju na hranu? Kliknite na bilo koje jelo za pregled svih 14 zakonskih alergena i detaljnih sastojaka.'
                : 'Have dietary sensitivities or allergies? Click any dish to review full allergen disclosures and preparation details.'}
            </span>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#20221F]/70">
          <span>
            {language === 'bs'
              ? `Prikazano ${filteredItems.length} jela i pića`
              : `Displaying ${filteredItems.length} items`}
          </span>
        </div>

        {/* Dishes Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E9E1D4] p-8">
            <AlertCircle className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif text-2xl font-semibold text-[#20221F] mb-1">
              {language === 'bs' ? 'Nema pronađenih artikala' : 'No items match your criteria'}
            </h3>
            <p className="text-xs text-[#20221F]/60 max-w-sm mx-auto mb-6">
              {language === 'bs'
                ? 'Pokušajte prilagoditi filtere ili očistiti pretragu.'
                : 'Try clearing your search terms or dietary filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDietary([]);
                setActiveType('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-[#59634A] text-white text-xs font-semibold"
            >
              {language === 'bs' ? 'Resetuj sve filtere' : 'Reset all filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((dish) => (
              <article
                key={dish.id}
                className="group bg-white rounded-3xl overflow-hidden border border-[#E8E2D6] shadow-[0_4px_24px_rgba(18,20,23,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Dish Image */}
                  <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-[#EDE7DD]/40">
                    <img
                      src={dish.imageUrl}
                      alt={language === 'bs' ? dish.name : dish.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
                      }}
                    />

                    {/* Floating Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      {dish.isChefRecommendation && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#121417]/95 text-[#C5A059] border border-[#C5A059]/40 shadow-xs backdrop-blur-sm">
                          {language === 'bs' ? 'Šef Preporučuje' : 'Chef Pick'}
                        </span>
                      )}
                      {dish.isBestseller && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#9B412D] text-white shadow-xs">
                          Bestseller
                        </span>
                      )}
                      {dish.isNew && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#8E723B] text-white shadow-xs">
                          {language === 'bs' ? 'Novo' : 'New'}
                        </span>
                      )}
                    </div>

                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 bg-[#121417]/95 backdrop-blur-md text-[#FAF8F5] border border-[#C5A059]/30 px-3 py-1 rounded-xl font-serif text-lg font-bold shadow-md">
                      {dish.price.toFixed(2)} <span className="text-xs font-sans text-[#C5A059]">KM</span>
                    </div>

                    {!dish.isAvailable && (
                      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="bg-rose-700 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-lg">
                          {language === 'bs' ? 'Trenutno Rasprodano' : 'Sold Out'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6">
                    {/* Dietary tags */}
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {dish.dietaryTags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] tracking-wide uppercase px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#8E723B] font-semibold border border-[#E8E2D6]"
                        >
                          {tag}
                        </span>
                      ))}
                      {dish.prepTimeMinutes && (
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 ml-auto">
                          <Clock className="w-3 h-3 text-[#C5A059]" />
                          <span>{dish.prepTimeMinutes}m</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-semibold text-[#121417] mb-1.5 group-hover:text-[#C5A059] transition-colors">
                      {language === 'bs' ? dish.name : dish.nameEn}
                    </h3>

                    <p className="text-xs text-[#121417]/70 line-clamp-2 leading-relaxed mb-3 font-light">
                      {language === 'bs' ? dish.shortDescription : dish.shortDescriptionEn}
                    </p>

                    {/* Allergens pills */}
                    {dish.allergens.length > 0 && (
                      <p className="text-[10px] text-stone-400">
                        {language === 'bs' ? 'Alergeni: ' : 'Allergens: '}
                        <span className="font-medium text-stone-600">{dish.allergens.join(', ')}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-[#E8E2D6]/50 flex items-center justify-between gap-2.5">
                  <button
                    onClick={() => setSelectedDish(dish)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-[#E8E2D6] hover:bg-[#FAF8F5] text-xs font-semibold text-[#121417] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#8E723B]" />
                    <span>{language === 'bs' ? 'Detalji' : 'View'}</span>
                  </button>

                  <button
                    onClick={() => addToCart(dish, 1)}
                    disabled={!dish.isAvailable}
                    className="py-2.5 px-4 rounded-xl bg-[#121417] hover:bg-[#C5A059] hover:text-[#121417] disabled:bg-stone-300 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                    aria-label={`Dodaj ${dish.name} u korpu`}
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'bs' ? 'Dodaj' : 'Add'}</span>
                  </button>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
