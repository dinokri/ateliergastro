import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { MenuItem, Order, OrderStatus, Reservation, ReservationStatus, RestaurantSettings } from '../../types/restaurant';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  ShoppingBag, 
  CalendarDays, 
  ChefHat, 
  Settings, 
  BarChart3, 
  LogOut, 
  Plus, 
  Check, 
  X, 
  Clock, 
  Printer, 
  Download, 
  Trash2, 
  Edit3, 
  DollarSign, 
  AlertCircle,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  LogIn
} from 'lucide-react';

const AdminDashboardContent: React.FC = () => {
  const {
    language,
    settings,
    updateSettings,
    categories,
    menuItems,
    updateMenuItem,
    addMenuItem,
    deleteMenuItem,
    toggleItemAvailability,
    orders,
    updateOrderStatus,
    reservations,
    updateReservationStatus,
  } = useRestaurant();

  const { user, isAdmin, loginWithGoogle, logout, simulateAdminAccess } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'menu' | 'orders' | 'kitchen' | 'reservations' | 'settings' | 'reports'
  >('overview');

  // Order filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  // Reservation filters
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string>('all');
  const [reservationSearchQuery, setReservationSearchQuery] = useState('');

  // Editing dish state
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isAddingNewDish, setIsAddingNewDish] = useState(false);

  // Temporary Settings Edit state
  const [tempSettings, setTempSettings] = useState<RestaurantSettings>(settings);

  // New dish form
  const [newDishName, setNewDishName] = useState('');
  const [newDishNameEn, setNewDishNameEn] = useState('');
  const [newDishCategory, setNewDishCategory] = useState(categories[0]?.id || 'starters');
  const [newDishPrice, setNewDishPrice] = useState(25);
  const [newDishDescription, setNewDishDescription] = useState('');
  const [newDishIngredients, setNewDishIngredients] = useState('');
  const [newDishImageUrl, setNewDishImageUrl] = useState('https://images.unsplash.com/photo-1544025162-d76694265947?w=800');

  // Login Gate if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#121417] text-[#FAF8F5] flex items-center justify-center p-4">
        <div className="bg-[#1A1D22] max-w-md w-full p-8 rounded-3xl border border-[#C5A059]/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#C5A059]/15 text-[#C5A059] mx-auto flex items-center justify-center border border-[#C5A059]/40 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-wide text-[#FAF8F5]">
              Atelier Bistro Admin
            </h1>
            <p className="text-xs text-[#FAF8F5]/70 mt-1">
              {language === 'bs' 
                ? 'Zaštićeni portal za upravljanje restoranom, narudžbama i jelovnikom.' 
                : 'Restricted administrative portal for restaurant operations.'}
            </p>
          </div>

          <div className="p-4 bg-[#121417] rounded-2xl border border-[#C5A059]/30 text-left text-xs space-y-1">
            <span className="text-[#C5A059] font-bold block uppercase tracking-wider text-[10px]">Ovlašteni Administrator:</span>
            <p className="text-white font-mono font-semibold text-sm">dinokrickovic555@gmail.com</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => loginWithGoogle()}
              className="w-full py-3.5 px-4 rounded-xl bg-[#C5A059] hover:bg-[#B38E46] text-[#121417] font-bold text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4 text-[#121417]" />
              <span>Prijava kao Dino Kričković (Admin)</span>
            </button>

            {/* Quick Demo Access for Staff */}
            <button
              onClick={simulateAdminAccess}
              className="w-full py-2.5 px-4 rounded-xl border border-white/20 text-[#FAF8F5]/80 hover:bg-white/10 text-xs font-medium transition-colors"
            >
              Uđi direktno u demonstracijski mod
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Real database metrics calculation
  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'new' || o.status === 'pending').length;
  const preparingOrdersCount = orders.filter((o) => o.status === 'preparing').length;
  const completedOrdersCount = orders.filter((o) => o.status === 'delivered' || o.status === 'completed').length;
  const pendingReservationsCount = reservations.filter((r) => r.status === 'pending').length;
  const confirmedReservationsCount = reservations.filter((r) => r.status === 'confirmed').length;

  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDish) return;
    await updateMenuItem(editingDish);
    setEditingDish(null);
  };

  const handleCreateDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    await addMenuItem({
      name: newDishName.trim(),
      nameEn: newDishNameEn.trim() || newDishName.trim(),
      categoryId: newDishCategory,
      price: Number(newDishPrice),
      shortDescription: newDishDescription.trim().slice(0, 100),
      shortDescriptionEn: newDishDescription.trim().slice(0, 100),
      description: newDishDescription.trim(),
      descriptionEn: newDishDescription.trim(),
      ingredients: newDishIngredients.trim(),
      ingredientsEn: newDishIngredients.trim(),
      prepTimeMinutes: 15,
      isAvailable: true,
      imageUrl: newDishImageUrl.trim(),
      dietaryTags: ['vegetarian'],
      allergens: [],
    });

    setIsAddingNewDish(false);
    setNewDishName('');
    setNewDishNameEn('');
    setNewDishDescription('');
    setNewDishIngredients('');
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(tempSettings);
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    const headers = 'Broj_Narudzbe,Datum,Kupac,Telefon,Tip,Status,Ukupno_KM\n';
    const rows = orders.map((o) => 
      `"${o.orderNumber}","${o.createdAt}","${o.customerName}","${o.customerPhone}","${o.orderType}","${o.status}",${o.total.toFixed(2)}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Atelier-Bistro-Orders-Export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    const matchesSearch = !orderSearchQuery.trim() || 
      o.orderNumber.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
      o.customerPhone.includes(orderSearchQuery);
    return matchesStatus && matchesSearch;
  });

  const filteredReservations = reservations.filter((r) => {
    const matchesStatus = reservationStatusFilter === 'all' || r.status === reservationStatusFilter;
    const matchesSearch = !reservationSearchQuery.trim() ||
      r.reservationNumber.toLowerCase().includes(reservationSearchQuery.toLowerCase()) ||
      r.customerName.toLowerCase().includes(reservationSearchQuery.toLowerCase()) ||
      r.customerPhone.includes(reservationSearchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#121417] flex flex-col">
      
      {/* Top Admin Navigation Bar */}
      <nav className="bg-[#121417] text-[#FAF8F5] px-4 sm:px-8 py-3.5 border-b border-[#C5A059]/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl tracking-wider font-bold uppercase text-[#FAF8F5]">
            {settings.name}
          </span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 text-[#C5A059] text-[10px] font-bold uppercase tracking-wider">
            Upravljački Panel
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold font-mono">{user?.email || 'dinokrickovic555@gmail.com'}</span>
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">(Administrator)</span>
          </div>

          <button
            onClick={() => logout()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/10 text-xs font-semibold text-stone-300 hover:text-white transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Odjavi se</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 bg-white border-r border-[#E8E2D6] p-4 flex md:flex-col gap-1 overflow-x-auto md:overflow-visible shrink-0 shadow-xs">
          {[
            { id: 'overview', label: 'Pregled (Overview)', icon: LayoutDashboard },
            { id: 'orders', label: 'Narudžbe', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
            { id: 'kitchen', label: 'Kuhinjski Ekran (KDS)', icon: ChefHat, badge: preparingOrdersCount > 0 ? preparingOrdersCount : undefined },
            { id: 'reservations', label: 'Rezervacije', icon: CalendarDays, badge: pendingReservationsCount > 0 ? pendingReservationsCount : undefined },
            { id: 'menu', label: 'Jelovnik & Cijene', icon: UtensilsCrossed },
            { id: 'reports', label: 'Izvještaji & Analitika', icon: BarChart3 },
            { id: 'settings', label: 'Postavke Restorana', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeAdminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveAdminTab(tab.id as any)}
                className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all shrink-0 md:w-full ${
                  active
                    ? 'bg-[#121417] text-[#C5A059] shadow-sm font-bold'
                    : 'text-[#121417]/75 hover:bg-[#FAF8F5] hover:text-[#121417]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${active ? 'text-[#C5A059]' : 'text-stone-400'}`} />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9B412D] text-white animate-pulse">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          
          {/* 1. OVERVIEW TAB */}
          {activeAdminTab === 'overview' && (
            <div className="space-y-8 max-w-6xl">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#20221F]">
                  Dnevni Pregled Poslovanja
                </h2>
                <p className="text-xs text-[#20221F]/60 mt-0.5">
                  Izvještaj baziran na stvarnim narudžbama i rezervacijama u bazi.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-5 rounded-2xl border border-[#E9E1D4] shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
                    <span>Ukupan Promet</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#20221F]">
                    {totalSales.toFixed(2)} KM
                  </div>
                  <span className="text-[11px] text-emerald-700 font-medium">Realizovane narudžbe</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E1D4] shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
                    <span>Narudžbe u Čekanju</span>
                    <Clock className="w-4 h-4 text-[#B66F52]" />
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#B66F52]">
                    {pendingOrdersCount}
                  </div>
                  <span className="text-[11px] text-stone-500">Zahtijeva potvrdu</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E1D4] shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
                    <span>Rezervacije na Čekanju</span>
                    <CalendarDays className="w-4 h-4 text-[#59634A]" />
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#59634A]">
                    {pendingReservationsCount}
                  </div>
                  <span className="text-[11px] text-stone-500">{confirmedReservationsCount} potvrđenih</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#E9E1D4] shadow-sm">
                  <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
                    <span>Završene Narudžbe</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="font-serif text-2xl font-bold text-[#20221F]">
                    {completedOrdersCount}
                  </div>
                  <span className="text-[11px] text-stone-500">Isporučeno i preuzeto</span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-2xl border border-[#E9E1D4] shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-semibold text-[#20221F]">
                    Posljednje Narudžbe
                  </h3>
                  <button
                    onClick={() => setActiveAdminTab('orders')}
                    className="text-xs font-semibold text-[#59634A] hover:underline"
                  >
                    Vidi sve narudžbe &rarr;
                  </button>
                </div>

                {orders.length === 0 ? (
                  <p className="text-xs text-stone-400 py-6 text-center">Trenutno nema unesenih narudžbi.</p>
                ) : (
                  <div className="divide-y divide-[#E9E1D4] text-xs">
                    {orders.slice(0, 5).map((ord) => (
                      <div key={ord.orderNumber} className="py-3 flex items-center justify-between">
                        <div>
                          <span className="font-mono font-bold text-[#20221F] mr-2">#{ord.orderNumber}</span>
                          <span className="text-stone-600 font-medium mr-2">{ord.customerName}</span>
                          <span className="text-stone-400 uppercase text-[10px]">({ord.orderType})</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-serif font-bold text-[#20221F]">{ord.total.toFixed(2)} KM</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                            {ord.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. ORDERS MANAGEMENT TAB */}
          {activeAdminTab === 'orders' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#20221F]">
                    Upravljanje Narudžbama
                  </h2>
                  <p className="text-xs text-[#20221F]/60">
                    Ažurirajte status narudžbi u realnom vremenu i printajte račune.
                  </p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      placeholder="Pretraži broj, kupca..."
                      className="text-xs pl-8 pr-3 py-2 rounded-xl border border-[#E9E1D4] bg-white focus:outline-none"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="text-xs py-2 px-3 rounded-xl border border-[#E9E1D4] bg-white font-semibold"
                  >
                    <option value="all">Svi statusi ({orders.length})</option>
                    <option value="new">Nove</option>
                    <option value="confirmed">Potvrđene</option>
                    <option value="preparing">U pripremi</option>
                    <option value="ready">Spremne</option>
                    <option value="out_for_delivery">Dostava</option>
                    <option value="delivered">Uručene</option>
                    <option value="cancelled">Otkazane</option>
                  </select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-[#E9E1D4]">
                  <p className="text-xs text-stone-500">Nema narudžbi koje odgovaraju odabranom filteru.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E9E1D4] shadow-sm overflow-hidden divide-y divide-[#E9E1D4]">
                  {filteredOrders.map((ord) => (
                    <div key={ord.orderNumber} className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      
                      {/* Left: Info */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#20221F]">#{ord.orderNumber}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F7F4ED] text-[#59634A] border border-[#E9E1D4]">
                            {ord.orderType.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs text-stone-400">
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div className="text-xs text-[#20221F]">
                          <strong className="mr-2">{ord.customerName}</strong>
                          <span className="text-stone-500 mr-2">{ord.customerPhone}</span>
                          {ord.tableId && (
                            <span className="font-bold text-[#B66F52]">Sto: {ord.tableId}</span>
                          )}
                          {ord.deliveryAddress && (
                            <span className="text-stone-500">
                              {ord.deliveryAddress.street} {ord.deliveryAddress.buildingNumber}, {ord.deliveryAddress.deliveryZone}
                            </span>
                          )}
                        </div>

                        {/* Items preview */}
                        <div className="text-[11px] text-stone-500 truncate max-w-xl">
                          {ord.items.map((i) => `${i.quantity}x ${i.menuItem.name}`).join(' &bull; ')}
                        </div>
                      </div>

                      {/* Right: Actions & Status dropdown */}
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-serif text-lg font-bold text-[#B66F52] mr-2">
                          {ord.total.toFixed(2)} KM
                        </span>

                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.orderNumber, e.target.value as OrderStatus)}
                          className="text-xs font-semibold py-1.5 px-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED] focus:outline-none focus:border-[#B66F52]"
                        >
                          <option value="new">Nova (New)</option>
                          <option value="confirmed">Potvrdi (Confirmed)</option>
                          <option value="preparing">Priprema (Cooking)</option>
                          <option value="ready">Spremno (Ready)</option>
                          <option value="out_for_delivery">Dostava (Out)</option>
                          <option value="delivered">Uručeno (Delivered)</option>
                          <option value="cancelled">Otkaži (Cancel)</option>
                        </select>

                        <button
                          onClick={() => setSelectedOrderForModal(ord)}
                          className="p-2 rounded-xl border border-[#E9E1D4] hover:bg-[#F7F4ED] text-xs font-medium text-[#20221F]"
                          title="Detalji i print računa"
                        >
                          <Printer className="w-4 h-4 text-[#59634A]" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. KITCHEN DISPLAY SYSTEM (KDS) */}
          {activeAdminTab === 'kitchen' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#20221F]">
                  Kuhinjski Displej (KDS)
                </h2>
                <p className="text-xs text-[#20221F]/60">
                  Pregled radnih naloga za kuhare sa jednim klikom za prelazak u status spremljeno.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders
                  .filter((o) => ['new', 'confirmed', 'preparing'].includes(o.status))
                  .map((kdsOrder) => (
                    <div
                      key={kdsOrder.orderNumber}
                      className="bg-white rounded-2xl border-2 border-[#59634A] shadow-md p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-[#E9E1D4]">
                          <span className="font-mono text-lg font-bold text-[#20221F]">
                            #{kdsOrder.orderNumber}
                          </span>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-[#59634A] text-white">
                            {kdsOrder.tableId ? `Sto: ${kdsOrder.tableId}` : kdsOrder.orderType}
                          </span>
                        </div>

                        <div className="divide-y divide-[#E9E1D4]/60 text-xs">
                          {kdsOrder.items.map((it) => (
                            <div key={it.cartItemId} className="py-2">
                              <div className="flex items-start justify-between font-bold text-sm text-[#20221F]">
                                <span>{it.quantity}x {it.menuItem.name}</span>
                              </div>
                              {it.selectedVariant && (
                                <p className="text-[11px] text-[#B66F52] font-semibold">
                                  &bull; {it.selectedVariant.name}
                                </p>
                              )}
                              {it.selectedExtras.length > 0 && (
                                <p className="text-[11px] text-stone-500">
                                  Prilozi: {it.selectedExtras.map((e) => e.name).join(', ')}
                                </p>
                              )}
                              {it.specialInstructions && (
                                <p className="text-[11px] bg-amber-50 p-1.5 rounded text-amber-900 font-semibold mt-1">
                                  Napomena: &quot;{it.specialInstructions}&quot;
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-[#E9E1D4] flex gap-2">
                        {kdsOrder.status !== 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(kdsOrder.orderNumber, 'preparing')}
                            className="flex-1 py-2.5 rounded-xl bg-[#59634A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#3F4734]"
                          >
                            Započni pripremu
                          </button>
                        )}
                        <button
                          onClick={() => updateOrderStatus(kdsOrder.orderNumber, kdsOrder.orderType === 'delivery' ? 'out_for_delivery' : 'ready')}
                          className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-700"
                        >
                          Spremno! &bull; Gotovo
                        </button>
                      </div>

                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 4. RESERVATIONS MANAGEMENT TAB */}
          {activeAdminTab === 'reservations' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#20221F]">
                    Upravljanje Rezervacijama
                  </h2>
                  <p className="text-xs text-[#20221F]/60">
                    Pregled, potvrđivanje i evidencija dolazaka gostiju.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={reservationSearchQuery}
                      onChange={(e) => setReservationSearchQuery(e.target.value)}
                      placeholder="Pretraži gosta, kod..."
                      className="text-xs pl-8 pr-3 py-2 rounded-xl border border-[#E9E1D4] bg-white focus:outline-none"
                    />
                  </div>

                  <select
                    value={reservationStatusFilter}
                    onChange={(e) => setReservationStatusFilter(e.target.value)}
                    className="text-xs py-2 px-3 rounded-xl border border-[#E9E1D4] bg-white font-semibold"
                  >
                    <option value="all">Sve rezervacije ({reservations.length})</option>
                    <option value="pending">Na čekanju</option>
                    <option value="confirmed">Potvrđene</option>
                    <option value="completed">Završene</option>
                    <option value="rejected">Odbijene</option>
                    <option value="cancelled">Otkazane</option>
                  </select>
                </div>
              </div>

              {filteredReservations.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-2xl border border-[#E9E1D4]">
                  <p className="text-xs text-stone-500">Nema rezervacija za prikaz.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[#E9E1D4] shadow-sm divide-y divide-[#E9E1D4]">
                  {filteredReservations.map((res) => (
                    <div key={res.reservationNumber} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#20221F]">#{res.reservationNumber}</span>
                          <span className="font-bold text-xs text-[#59634A]">{res.date} u {res.time}h</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">
                            {res.guests} osoba
                          </span>
                        </div>
                        <div className="text-xs text-[#20221F]">
                          <strong className="mr-2">{res.customerName}</strong>
                          <span className="text-stone-500 mr-2">{res.customerPhone}</span>
                          <span className="text-stone-400 capitalize">{res.seatingArea.replace(/_/g, ' ')}</span>
                        </div>
                        {res.specialRequests && (
                          <p className="text-[11px] text-stone-500 italic">
                            Zahtjev: &quot;{res.specialRequests}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {res.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateReservationStatus(res.reservationNumber, 'confirmed')}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Potvrdi</span>
                            </button>
                            <button
                              onClick={() => updateReservationStatus(res.reservationNumber, 'rejected')}
                              className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                            >
                              Odbij
                            </button>
                          </>
                        )}
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => updateReservationStatus(res.reservationNumber, 'completed')}
                            className="px-3.5 py-1.5 rounded-xl bg-[#59634A] text-white text-xs font-semibold"
                          >
                            Označi kao Završeno
                          </button>
                        )}
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-stone-100 text-[#20221F]">
                          {res.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. MENU MANAGEMENT TAB */}
          {activeAdminTab === 'menu' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#20221F]">
                    Upravljanje Jelovnikom & Cijenama
                  </h2>
                  <p className="text-xs text-[#20221F]/60">
                    Mijenjajte cijene, opise, dostupnost ili dodajte nova autorska jela.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingNewDish(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#B66F52] hover:bg-[#96533A] text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Kreiraj Novo Jelo</span>
                </button>
              </div>

              {/* Items Table */}
              <div className="bg-white rounded-2xl border border-[#E9E1D4] shadow-sm overflow-hidden">
                <div className="divide-y divide-[#E9E1D4]">
                  {menuItems.map((dish) => (
                    <div key={dish.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-14 h-14 rounded-xl object-cover border border-[#E9E1D4]"
                        />
                        <div>
                          <h4 className="font-serif text-base font-semibold text-[#20221F]">
                            {dish.name}
                          </h4>
                          <span className="text-xs text-stone-500 font-mono">
                            {dish.price.toFixed(2)} KM &bull; Kat: {dish.categoryId}
                          </span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleItemAvailability(dish.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                            dish.isAvailable
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {dish.isAvailable ? 'Dostupno' : 'Rasprodano'}
                        </button>

                        <button
                          onClick={() => setEditingDish(dish)}
                          className="p-2 rounded-lg border border-[#E9E1D4] hover:bg-[#F7F4ED] text-stone-700"
                          title="Uredi jelo"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => deleteMenuItem(dish.id)}
                          className="p-2 rounded-lg border border-[#E9E1D4] hover:bg-rose-50 text-rose-600"
                          title="Izbriši jelo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 6. REPORTS & CSV EXPORT TAB */}
          {activeAdminTab === 'reports' && (
            <div className="space-y-6 max-w-6xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#20221F]">
                    Izvještaji & Analitika
                  </h2>
                  <p className="text-xs text-[#20221F]/60">
                    Pregled finansijskih pokazatelja i izvoz podataka u CSV format.
                  </p>
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 rounded-xl bg-[#59634A] hover:bg-[#3F4734] text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Izvezi CSV Narudžbi</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm">
                  <span className="text-xs text-stone-500 font-semibold uppercase">Prosječna vrijednost narudžbe</span>
                  <div className="font-serif text-3xl font-bold text-[#20221F] mt-2">
                    {orders.length > 0 ? (totalSales / orders.length).toFixed(2) : '0.00'} KM
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">AOV (Average Order Value)</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm">
                  <span className="text-xs text-stone-500 font-semibold uppercase">Ukupno Rezervacija</span>
                  <div className="font-serif text-3xl font-bold text-[#20221F] mt-2">
                    {reservations.length}
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">{confirmedReservationsCount} potvrđeno</span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#E9E1D4] shadow-sm">
                  <span className="text-xs text-stone-500 font-semibold uppercase">Stopa realizacije</span>
                  <div className="font-serif text-3xl font-bold text-emerald-700 mt-2">
                    {orders.length > 0 ? Math.round((completedOrdersCount / orders.length) * 100) : 100}%
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">Uspješno isporučeno</span>
                </div>
              </div>
            </div>
          )}

          {/* 7. RESTAURANT SETTINGS TAB */}
          {activeAdminTab === 'settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#20221F]">
                  Postavke Poslovanja & Brandinga
                </h2>
                <p className="text-xs text-[#20221F]/60">
                  Uredite naziv, adresu, telefon, naknade za dostavu i GPS koordinate bez koda.
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9E1D4] shadow-sm space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">Naziv Restorana</label>
                    <input
                      type="text"
                      value={tempSettings.name}
                      onChange={(e) => setTempSettings({ ...tempSettings, name: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED]/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">Slogan (Tagline)</label>
                    <input
                      type="text"
                      value={tempSettings.tagline}
                      onChange={(e) => setTempSettings({ ...tempSettings, tagline: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED]/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">Broj Telefona</label>
                    <input
                      type="text"
                      value={tempSettings.phone}
                      onChange={(e) => setTempSettings({ ...tempSettings, phone: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED]/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">Email Adresa</label>
                    <input
                      type="email"
                      value={tempSettings.email}
                      onChange={(e) => setTempSettings({ ...tempSettings, email: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED]/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">Adresa Restorana</label>
                    <input
                      type="text"
                      value={tempSettings.address}
                      onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED]/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">Grad</label>
                    <input
                      type="text"
                      value={tempSettings.city}
                      onChange={(e) => setTempSettings({ ...tempSettings, city: e.target.value })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED]/40 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">Standardna Naknada Dostave (KM)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={tempSettings.standardDeliveryFee}
                      onChange={(e) => setTempSettings({ ...tempSettings, standardDeliveryFee: Number(e.target.value) })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED]/40 focus:outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#20221F] mb-1">Prag za Besplatnu Dostavu (KM)</label>
                    <input
                      type="number"
                      step="1"
                      value={tempSettings.freeDeliveryThreshold}
                      onChange={(e) => setTempSettings({ ...tempSettings, freeDeliveryThreshold: Number(e.target.value) })}
                      className="w-full text-xs p-3 rounded-xl border border-[#E9E1D4] bg-[#F7F4ED]/40 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="py-3 px-8 rounded-xl bg-[#59634A] hover:bg-[#3F4734] text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Spasi Promjene Postavki
                </button>
              </form>
            </div>
          )}

        </main>
      </div>

      {/* Modal: Edit Dish */}
      {editingDish && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 border border-[#E9E1D4] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E1D4]">
              <h3 className="font-serif text-xl font-semibold">Uredi Jelo</h3>
              <button onClick={() => setEditingDish(null)} className="text-stone-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Naziv jela (Bosanski)</label>
                <input
                  type="text"
                  value={editingDish.name}
                  onChange={(e) => setEditingDish({ ...editingDish, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E9E1D4]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Cijena u KM (BAM)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editingDish.price}
                  onChange={(e) => setEditingDish({ ...editingDish, price: Number(e.target.value) })}
                  className="w-full p-2.5 rounded-xl border border-[#E9E1D4] font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Opis jela</label>
                <textarea
                  rows={2}
                  value={editingDish.description}
                  onChange={(e) => setEditingDish({ ...editingDish, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E9E1D4]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Sastojci</label>
                <input
                  type="text"
                  value={editingDish.ingredients}
                  onChange={(e) => setEditingDish({ ...editingDish, ingredients: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#E9E1D4]"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDish.isAvailable}
                    onChange={(e) => setEditingDish({ ...editingDish, isAvailable: e.target.checked })}
                    className="rounded text-[#59634A]"
                  />
                  <span>Dostupno za naručivanje</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDish.isBestseller}
                    onChange={(e) => setEditingDish({ ...editingDish, isBestseller: e.target.checked })}
                    className="rounded text-[#B66F52]"
                  />
                  <span>Bestseller</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E9E1D4]">
                <button
                  type="button"
                  onClick={() => setEditingDish(null)}
                  className="px-4 py-2 rounded-xl border border-[#E9E1D4]"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#59634A] text-white font-semibold"
                >
                  Spasi Izmjene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create New Dish */}
      {isAddingNewDish && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-3xl p-6 border border-[#E9E1D4] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E1D4]">
              <h3 className="font-serif text-xl font-semibold">Kreiraj Novo Jelo / Piće</h3>
              <button onClick={() => setIsAddingNewDish(false)} className="text-stone-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDish} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Naziv (Bosanski) *</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="Npr. Janjeći kotleti"
                    className="w-full p-2.5 rounded-xl border border-[#E9E1D4]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Naziv (Engleski)</label>
                  <input
                    type="text"
                    value={newDishNameEn}
                    onChange={(e) => setNewDishNameEn(e.target.value)}
                    placeholder="Npr. Lamb Cutlets"
                    className="w-full p-2.5 rounded-xl border border-[#E9E1D4]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Kategorija</label>
                  <select
                    value={newDishCategory}
                    onChange={(e) => setNewDishCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E9E1D4] bg-white font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Cijena (KM) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newDishPrice}
                    onChange={(e) => setNewDishPrice(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E9E1D4] font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Opis jela</label>
                <textarea
                  rows={2}
                  value={newDishDescription}
                  onChange={(e) => setNewDishDescription(e.target.value)}
                  placeholder="Kratak opis okusa i tehnike..."
                  className="w-full p-2.5 rounded-xl border border-[#E9E1D4]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Sastojci</label>
                <input
                  type="text"
                  value={newDishIngredients}
                  onChange={(e) => setNewDishIngredients(e.target.value)}
                  placeholder="Meso, timijan, ulje..."
                  className="w-full p-2.5 rounded-xl border border-[#E9E1D4]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">URL Fotografije</label>
                <input
                  type="url"
                  value={newDishImageUrl}
                  onChange={(e) => setNewDishImageUrl(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E9E1D4]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E9E1D4]">
                <button
                  type="button"
                  onClick={() => setIsAddingNewDish(false)}
                  className="px-4 py-2 rounded-xl border border-[#E9E1D4]"
                >
                  Odustani
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#B66F52] text-white font-semibold uppercase tracking-wider"
                >
                  Dodaj na Meni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Print Receipt for Order */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl p-6 border border-[#E9E1D4] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E9E1D4]">
              <span className="text-xs font-bold font-mono">#{selectedOrderForModal.orderNumber}</span>
              <button onClick={() => setSelectedOrderForModal(null)} className="text-stone-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Receipt Slip */}
            <div className="printable-area text-xs font-mono p-4 border border-dashed border-stone-300 rounded-lg space-y-2 bg-[#F7F4ED]">
              <div className="text-center pb-2 border-b border-dashed border-stone-400">
                <h4 className="font-bold text-sm uppercase">{settings.name}</h4>
                <p className="text-[10px]">{settings.address}, Sarajevo</p>
                <p className="text-[10px]">Tel: {settings.phone}</p>
                <p className="text-[10px] mt-1">{new Date(selectedOrderForModal.createdAt).toLocaleString()}</p>
              </div>

              <div className="py-1">
                <p><strong>Kupac:</strong> {selectedOrderForModal.customerName}</p>
                <p><strong>Telefon:</strong> {selectedOrderForModal.customerPhone}</p>
                <p><strong>Tip:</strong> {selectedOrderForModal.orderType.toUpperCase()}</p>
                {selectedOrderForModal.tableId && <p><strong>Sto:</strong> {selectedOrderForModal.tableId}</p>}
              </div>

              <div className="border-t border-b border-dashed border-stone-400 py-2 space-y-1">
                {selectedOrderForModal.items.map((it) => (
                  <div key={it.cartItemId} className="flex justify-between">
                    <span>{it.quantity}x {it.menuItem.name}</span>
                    <span>{it.lineTotal.toFixed(2)} KM</span>
                  </div>
                ))}
              </div>

              <div className="pt-1 flex justify-between font-bold text-sm">
                <span>UKUPNO:</span>
                <span>{selectedOrderForModal.total.toFixed(2)} KM</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#59634A] text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Printaj Račun</span>
              </button>
              <button
                onClick={() => setSelectedOrderForModal(null)}
                className="px-4 py-2.5 rounded-xl border border-[#E9E1D4] text-xs font-semibold"
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <AuthProvider>
      <AdminDashboardContent />
    </AuthProvider>
  );
};
