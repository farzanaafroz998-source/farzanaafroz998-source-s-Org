
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, MapPin, ShoppingCart, Star, Clock, ChevronRight, User, 
  Home, List, Sparkles, Phone, ShieldCheck, CreditCard, CheckCircle2,
  ArrowLeft, LogOut, Package, Bike, ChevronLeft, Map as MapIcon, X,
  History, Navigation, HelpCircle, Heart, Tag, Settings, LocateFixed, Loader2
} from 'lucide-react';
import { DUMMY_RESTAURANTS } from '../constants';
import { Restaurant, MenuItem, CustomerView, Order } from '../types';
import { getSmartRecommendations } from '../services/gemini';

const CustomerApp: React.FC = () => {
  const [view, setView] = useState<CustomerView>('AUTH_LOGIN');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRes, setSelectedRes] = useState<Restaurant | null>(null);
  const [cart, setCart] = useState<{item: MenuItem, qty: number}[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [history, setHistory] = useState<Order[]>([]);
  const [aiRec, setAiRec] = useState<string>("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Address Form State
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [isLocating, setIsLocating] = useState(false);

  // Simulated live tracking progress
  const [trackingProgress, setTrackingProgress] = useState(40);

  useEffect(() => {
    let interval: any;
    if (view === 'ORDER_TRACKING' && trackingProgress < 100) {
      interval = setInterval(() => {
        setTrackingProgress(prev => Math.min(prev + 1, 100));
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [view, trackingProgress]);

  // Search and Category Filter logic
  const filteredRestaurants = useMemo(() => {
    return DUMMY_RESTAURANTS.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           res.cuisine.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || res.cuisine.includes(selectedCategory);
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // Cart Logic
  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) return prev.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.item.id !== id));
  };

  const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);

  // Geolocation Handler
  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // In a real app, we would call a Reverse Geocoding API here.
          // For the prototype, we populate with coordinates and a mock city.
          setAddress({
            street: `${latitude.toFixed(4)}, ${longitude.toFixed(4)} (GPS Location)`,
            city: 'San Francisco',
            state: 'CA',
            zip: '94105'
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Unable to retrieve your location. Please enter it manually.");
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
    }
  };

  // AI Recommendation Trigger
  const handleAskAi = async () => {
    setIsAiLoading(true);
    const rec = await getSmartRecommendations("I want something healthy but filling for lunch");
    setAiRec(rec || "");
    setIsAiLoading(false);
  };

  // Auth Handlers
  const handleLogin = () => {
    if (phone.length === 10) setView('AUTH_OTP');
    else alert("Please enter a valid 10-digit number");
  };

  const handleVerify = () => {
    if (otp === '1234') setView('HOME');
    else alert("Invalid OTP. Try '1234'");
  };

  // Place Order Flow
  const handlePlaceOrder = () => {
    if (!address.street || !address.city) {
      alert("Please enter a delivery address.");
      return;
    }

    const newOrder: Order = {
      id: `FAST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: "Current User",
      restaurantName: selectedRes?.name || "Unknown",
      items: cart.map(c => c.item),
      total: total + 2.99, // Total + delivery
      status: 'preparing',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActiveOrder(newOrder);
    setHistory(prev => [newOrder, ...prev]);
    setCart([]);
    setTrackingProgress(20);
    setView('ORDER_SUCCESS');
  };

  const reorder = (order: Order) => {
    const res = DUMMY_RESTAURANTS.find(r => r.name === order.restaurantName);
    if (res) {
      setSelectedRes(res);
      setCart(order.items.map(item => ({ item, qty: 1 })));
      setView('CART');
    }
  };

  // Sub-Views Components
  const AuthLogin = () => (
    <div className="flex flex-col h-full justify-center p-8 animate-in fade-in slide-in-from-bottom duration-500">
      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-orange-200">
          <ShieldCheck size={40} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">FASTgo</h1>
        <p className="text-gray-500">Food delivery at lightning speed</p>
      </div>
      <div className="space-y-4">
        <div className="bg-gray-100 rounded-2xl p-4 flex items-center">
          <Phone className="text-gray-400 mr-3" size={20} />
          <input 
            type="tel" 
            placeholder="Mobile Number" 
            className="bg-transparent w-full focus:outline-none font-medium"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button 
          onClick={handleLogin}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-100 active:scale-95 transition-all"
        >
          Send OTP
        </button>
      </div>
    </div>
  );

  const AuthOtp = () => (
    <div className="flex flex-col h-full justify-center p-8 animate-in fade-in duration-300">
      <button onClick={() => setView('AUTH_LOGIN')} className="mb-6"><ArrowLeft size={24} /></button>
      <h2 className="text-2xl font-bold mb-2">Verify Phone</h2>
      <p className="text-gray-500 mb-8">Enter the 4-digit code sent to {phone}</p>
      <div className="flex space-x-4 mb-8">
        <input 
          type="text" 
          maxLength={4}
          placeholder="1234"
          className="w-full bg-gray-100 rounded-2xl py-4 text-center text-2xl font-black tracking-[1em] focus:outline-none focus:ring-2 focus:ring-orange-500"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <button 
        onClick={handleVerify}
        className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-all"
      >
        Verify & Continue
      </button>
    </div>
  );

  const HomeView = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="p-6 pb-2 pt-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Deliver to</span>
            <div className="flex items-center space-x-1 cursor-pointer">
              <MapPin size={16} className="text-orange-500" />
              <span className="font-bold text-sm">Downtown Office, Bldg 4</span>
              <ChevronRight size={14} />
            </div>
          </div>
          <div className="bg-gray-100 p-2.5 rounded-full cursor-pointer relative" onClick={() => setView('CART')}>
            <ShoppingCart size={20} />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search burgers, sushi, pizza..." 
            className="w-full bg-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all border-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          {["All", "Burgers", "Sushi", "Italian", "Desserts", "Offers"].map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* AI Banner */}
        <div 
          onClick={handleAskAi}
          className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-5 text-white mb-8 relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
          <div className="flex items-center space-x-2 mb-2 relative z-10">
            <Sparkles size={20} className="text-orange-300" />
            <span className="font-extrabold text-sm uppercase tracking-tighter">AI Concierge</span>
          </div>
          <p className="text-sm opacity-90 font-medium relative z-10 leading-snug">
            {isAiLoading ? "Syncing with Gemini..." : (aiRec || "Tired of picking? Let Gemini suggest your next meal.")}
          </p>
        </div>

        <h3 className="font-black text-xl mb-4 tracking-tight">
          {searchQuery ? `Results for "${searchQuery}"` : "Nearby Restaurants"}
        </h3>
        
        {filteredRestaurants.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <Search size={48} className="opacity-10 mb-2" />
             <p className="font-bold">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 pb-24">
            {filteredRestaurants.map(res => (
              <div 
                key={res.id} 
                className="group cursor-pointer active:scale-[0.99] transition-all" 
                onClick={() => { setSelectedRes(res); setView('RESTAURANT_DETAIL'); }}
              >
                <div className="relative rounded-[2rem] overflow-hidden mb-3 h-44 shadow-sm border border-gray-100">
                  <img src={res.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm">
                    <span className="text-[10px] font-black text-orange-600 tracking-tighter uppercase">Popular</span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex space-x-2">
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm flex items-center">
                      <Star size={12} className="text-orange-500 mr-1 fill-current" /> {res.rating}
                    </div>
                    <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm flex items-center">
                      <Clock size={12} className="text-gray-500 mr-1" /> {res.deliveryTime}
                    </div>
                  </div>
                </div>
                <div className="px-1 flex justify-between items-center">
                  <div>
                    <h4 className="font-black text-base text-gray-900">{res.name}</h4>
                    <p className="text-xs text-gray-400 font-medium">{res.cuisine}</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                    <ChevronRight size={18} className="text-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const RestaurantDetail = () => (
    <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300 overflow-y-auto pb-24">
      <div className="relative h-64">
        <img src={selectedRes?.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <button 
          onClick={() => setView('HOME')} 
          className="absolute top-10 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="absolute bottom-6 left-6 text-white">
          <h2 className="text-3xl font-black mb-1">{selectedRes?.name}</h2>
          <p className="text-sm opacity-80">{selectedRes?.cuisine}</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-8 pb-6 border-b">
           <div className="text-center px-4">
             <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Rating</p>
             <p className="font-black text-lg flex items-center justify-center text-orange-600"><Star size={18} className="mr-1 fill-current" /> {selectedRes?.rating}</p>
           </div>
           <div className="h-10 w-[1px] bg-gray-100"></div>
           <div className="text-center px-4">
             <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Time</p>
             <p className="font-black text-lg">{selectedRes?.deliveryTime}</p>
           </div>
           <div className="h-10 w-[1px] bg-gray-100"></div>
           <div className="text-center px-4">
             <p className="text-xs text-gray-400 font-bold mb-1 uppercase">Reviews</p>
             <p className="font-black text-lg">1.2k</p>
           </div>
        </div>

        <h3 className="font-black text-xl mb-6">Menu Items</h3>
        <div className="space-y-6">
          {selectedRes?.menu.map(item => (
            <div key={item.id} className="flex space-x-4">
              <img src={item.image} className="w-20 h-20 rounded-2xl object-cover" />
              <div className="flex-1">
                <h4 className="font-bold text-sm mb-1">{item.name}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-black text-orange-600 text-sm">${item.price}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="bg-orange-500 text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-xl hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CartView = () => (
    <div className="flex flex-col h-full p-6 animate-in slide-in-from-bottom duration-400">
      <div className="flex justify-between items-center mb-8">
        <button onClick={() => setView('HOME')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-black">Your Cart</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto mb-6">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <ShoppingCart size={64} className="mb-4 opacity-10" />
            <p className="font-bold">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="p-4 bg-orange-50 rounded-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Tag size={20} className="text-orange-600" />
                <span className="text-sm font-bold">Promo code applied</span>
              </div>
              <span className="text-xs font-black text-orange-600">-$2.00</span>
            </div>
            {cart.map(c => (
              <div key={c.item.id} className="flex items-center space-x-4">
                <img src={c.item.image} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{c.item.name}</h4>
                  <p className="text-xs text-orange-600 font-bold">${c.item.price} x {c.qty}</p>
                </div>
                <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
                   <button onClick={() => removeFromCart(c.item.id)} className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-400">-</button>
                   <span className="text-xs font-bold w-4 text-center">{c.qty}</span>
                   <button onClick={() => addToCart(c.item)} className="w-6 h-6 flex items-center justify-center bg-orange-500 rounded shadow-sm text-white">+</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="bg-gray-50 rounded-3xl p-6">
          <div className="flex justify-between mb-2 text-gray-500 text-sm">
            <span>Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-500 text-sm">
            <span>Delivery Fee</span>
            <span>$2.99</span>
          </div>
          <div className="flex justify-between mb-6 text-xl font-black border-t pt-4">
            <span>Total</span>
            <span className="text-orange-600">${(total + 2.99).toFixed(2)}</span>
          </div>
          <button 
            onClick={() => setView('CHECKOUT')}
            className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-100 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  const CheckoutView = () => (
    <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-300">
      <div className="flex items-center space-x-4 mb-8">
        <button onClick={() => setView('CART')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-black">Checkout</h2>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto pb-4">
        {/* Delivery Address Section Refined */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Delivery Address</h3>
            <button 
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="flex items-center space-x-1 text-xs font-bold text-orange-600 active:scale-95 transition-all disabled:opacity-50"
            >
              {isLocating ? <Loader2 size={12} className="animate-spin" /> : <LocateFixed size={12} />}
              <span>{isLocating ? 'Locating...' : 'Use Current Location'}</span>
            </button>
          </div>
          
          <div className="space-y-3">
            <input 
              type="text"
              placeholder="Street Address (e.g., 123 Tech Ave)"
              value={address.street}
              onChange={(e) => setAddress({...address, street: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({...address, city: e.target.value})}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
              />
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({...address, state: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                />
                <input 
                  type="text"
                  placeholder="Zip"
                  value={address.zip}
                  onChange={(e) => setAddress({...address, zip: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-end mb-3">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Payment Method</h3>
          </div>
          <div className="space-y-3">
             <div className="flex items-center justify-between p-4 bg-gray-100 rounded-2xl cursor-pointer">
                <div className="flex items-center space-x-3">
                   <CreditCard size={20} />
                   <span className="font-bold text-sm">**** **** **** 4242</span>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-orange-500 bg-orange-500 flex items-center justify-center">
                   <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
             </div>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Special Instructions</h3>
          <textarea 
            placeholder="Add a note for the rider (e.g., call when outside)"
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium h-24 resize-none"
          />
        </section>
      </div>

      <button 
        onClick={handlePlaceOrder}
        className="mt-4 bg-orange-600 text-white font-black py-5 rounded-[2.5rem] shadow-2xl shadow-orange-200 active:scale-[0.98] transition-all"
      >
        Place Order • ${(total + 2.99).toFixed(2)}
      </button>
    </div>
  );

  const OrderSuccess = () => (
    <div className="flex flex-col h-full items-center justify-center p-8 animate-in zoom-in duration-500">
      <div className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-8 animate-bounce">
        <CheckCircle2 size={64} />
      </div>
      <h2 className="text-3xl font-black mb-2 text-center">Order Confirmed!</h2>
      <p className="text-gray-500 text-center mb-10 leading-relaxed">
        Your order <span className="text-orange-600 font-bold">{activeOrder?.id}</span> is being prepared by {activeOrder?.restaurantName}.
      </p>
      <button 
        onClick={() => setView('ORDER_TRACKING')}
        className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-xl shadow-gray-200 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
      >
        <MapIcon size={20} />
        <span>Track Live Order</span>
      </button>
    </div>
  );

  const TrackingView = () => (
    <div className="flex flex-col h-full animate-in fade-in duration-300 relative">
      <div className="absolute inset-0 bg-gray-200 overflow-hidden">
        {/* Mock Map Background */}
        <div className="w-full h-full bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-122.4194,37.7749,12/400x800?access_token=pk.xxx')] bg-cover opacity-60"></div>
        {/* Simulated Road Lines */}
        <div className="absolute top-[40%] left-[20%] w-[60%] h-[2px] bg-white/40 rotate-[35deg]"></div>
        <div className="absolute top-[55%] left-[10%] w-[80%] h-[2px] bg-white/40 -rotate-[10deg]"></div>
        
        {/* Animated Rider Marker */}
        <div 
           className="absolute transition-all duration-3000 ease-linear flex flex-col items-center"
           style={{ 
             top: `${50 - (trackingProgress / 4)}%`, 
             left: `${50 - (trackingProgress / 3)}%` 
           }}
        >
           <div className="bg-orange-500 text-white p-3 rounded-full shadow-2xl border-4 border-white animate-pulse">
             <Bike size={24} />
           </div>
           <div className="bg-white px-2 py-0.5 rounded shadow-sm text-[8px] font-black mt-1">Marco (Rider)</div>
        </div>

        {/* User Location Marker */}
        <div className="absolute top-[45%] left-[45%] flex flex-col items-center">
           <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white shadow-lg"></div>
           <div className="bg-white px-2 py-0.5 rounded shadow-sm text-[8px] font-black mt-1 uppercase tracking-tighter">You</div>
        </div>
      </div>

      <div className="mt-12 mx-6 relative z-10 flex justify-between">
         <button onClick={() => setView('HOME')} className="bg-white p-3 rounded-full shadow-lg">
            <ArrowLeft size={20} />
         </button>
         <button className="bg-white p-3 rounded-full shadow-lg">
            <HelpCircle size={20} />
         </button>
      </div>

      <div className="mt-auto bg-white rounded-t-[3rem] p-8 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative z-10 animate-in slide-in-from-bottom duration-500">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-2xl font-black">{100 - trackingProgress > 5 ? Math.ceil((100 - trackingProgress)/4) : 2} min away</h3>
            <p className="text-sm text-gray-400 font-medium">
              {trackingProgress < 30 ? "Chef is cooking..." : trackingProgress < 60 ? "Rider is picking up..." : "Rider is on the way!"}
            </p>
          </div>
          <div className="bg-orange-100 p-4 rounded-3xl text-orange-600">
            {trackingProgress < 60 ? <Package size={28} /> : <Navigation size={28} />}
          </div>
        </div>

        <div className="relative h-1.5 w-full bg-gray-100 rounded-full mb-10 overflow-hidden">
           <div 
             className="absolute top-0 left-0 h-full bg-orange-500 rounded-full transition-all duration-1000"
             style={{ width: `${trackingProgress}%` }}
           ></div>
        </div>

        <div className="flex items-center space-x-4 pt-6 border-t">
           <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=marco" className="w-full h-full object-cover" />
           </div>
           <div className="flex-1">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Your Rider</p>
              <h4 className="font-bold">Marco Rodriguez</h4>
              <div className="flex items-center text-orange-500 text-[10px] font-bold">
                <Star size={10} className="mr-0.5 fill-current" /> 4.9 (2k+ deliveries)
              </div>
           </div>
           <button className="bg-gray-900 text-white p-4 rounded-2xl active:scale-90 transition-transform">
              <Phone size={20} />
           </button>
        </div>
      </div>
    </div>
  );

  const OrderHistoryView = () => (
    <div className="flex flex-col h-full p-8 animate-in fade-in duration-300 overflow-y-auto pb-24">
       <div className="flex items-center space-x-4 mb-8">
          <button onClick={() => setView('PROFILE')} className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-3xl font-black">Order History</h1>
       </div>

       {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
             <History size={64} className="opacity-10 mb-4" />
             <p className="font-bold">No past orders found</p>
             <button onClick={() => setView('HOME')} className="text-orange-500 font-bold mt-2 underline">Explore Restaurants</button>
          </div>
       ) : (
          <div className="space-y-6">
             {history.map(order => (
                <div key={order.id} className="bg-white border rounded-[2rem] p-6 shadow-sm">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                         <h4 className="font-black text-lg">{order.restaurantName}</h4>
                         <p className="text-xs text-gray-400">{order.timestamp} • {order.items.length} items</p>
                      </div>
                      <span className="text-sm font-black text-orange-600">${order.total.toFixed(2)}</span>
                   </div>
                   <div className="flex space-x-2 mb-6">
                      {order.items.slice(0, 3).map((item, i) => (
                         <img key={i} src={item.image} className="w-10 h-10 rounded-lg object-cover grayscale opacity-60" />
                      ))}
                      {order.items.length > 3 && <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] font-bold">+{order.items.length - 3}</div>}
                   </div>
                   <div className="flex space-x-3">
                      <button 
                        onClick={() => reorder(order)}
                        className="flex-1 bg-gray-100 text-gray-900 font-bold py-3 rounded-xl text-sm"
                      >
                         Re-order
                      </button>
                      <button className="flex-1 bg-white border font-bold py-3 rounded-xl text-sm">
                         Get Receipt
                      </button>
                   </div>
                </div>
             ))}
          </div>
       )}
    </div>
  );

  const ProfileView = () => (
    <div className="flex flex-col h-full p-8 animate-in fade-in duration-300">
       <div className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-black tracking-tighter">My Account</h1>
          <button className="bg-gray-100 p-3 rounded-full"><Settings size={20} /></button>
       </div>

       <div className="flex items-center space-x-5 mb-12">
          <div className="relative">
             <div className="w-24 h-24 bg-orange-100 rounded-[2.5rem] flex items-center justify-center text-orange-600 border-4 border-white shadow-lg">
                <User size={48} />
             </div>
             <div className="absolute -bottom-1 -right-1 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center text-white">
                <ShieldCheck size={14} />
             </div>
          </div>
          <div>
             <h3 className="text-2xl font-black">Alex Thompson</h3>
             <p className="text-sm text-gray-400 font-medium">FASTgo Gold Member</p>
          </div>
       </div>

       <div className="space-y-3">
          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] hover:bg-gray-100 cursor-pointer transition-all group" onClick={() => setView('ORDER_HISTORY')}>
             <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><History size={20} /></div>
                <span className="font-bold">Order History</span>
             </div>
             <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
          </div>
          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] hover:bg-gray-100 cursor-pointer transition-all group">
             <div className="flex items-center space-x-4">
                <div className="bg-pink-100 p-3 rounded-2xl text-pink-600"><Heart size={20} /></div>
                <span className="font-bold">Favorites</span>
             </div>
             <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
          </div>
          <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] hover:bg-gray-100 cursor-pointer transition-all group">
             <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-2xl text-purple-600"><MapPin size={20} /></div>
                <span className="font-bold">My Addresses</span>
             </div>
             <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
          </div>
          <div className="pt-8">
             <button 
                onClick={() => setView('AUTH_LOGIN')}
                className="w-full flex items-center justify-center space-x-2 text-red-500 font-black py-4 rounded-3xl bg-red-50 hover:bg-red-100 transition-colors"
             >
                <LogOut size={20} />
                <span>Log Out</span>
             </button>
          </div>
       </div>
    </div>
  );

  // Router Engine
  const renderContent = () => {
    switch (view) {
      case 'AUTH_LOGIN': return <AuthLogin />;
      case 'AUTH_OTP': return <AuthOtp />;
      case 'HOME': return <HomeView />;
      case 'RESTAURANT_DETAIL': return <RestaurantDetail />;
      case 'CART': return <CartView />;
      case 'CHECKOUT': return <CheckoutView />;
      case 'ORDER_SUCCESS': return <OrderSuccess />;
      case 'ORDER_TRACKING': return <TrackingView />;
      case 'ORDER_HISTORY': return <OrderHistoryView />;
      case 'PROFILE': return <ProfileView />;
      default: return <HomeView />;
    }
  };

  const showFooter = !['AUTH_LOGIN', 'AUTH_OTP', 'ORDER_SUCCESS', 'ORDER_TRACKING'].includes(view);

  return (
    <div className="max-w-md mx-auto h-[800px] bg-white shadow-2xl rounded-[3.5rem] border-[10px] border-gray-900 overflow-hidden relative flex flex-col">
      {/* Dynamic Status Bar Simulation */}
      <div className="h-10 flex justify-between items-center px-8 text-[11px] font-black text-gray-900 pt-10 absolute top-0 left-0 right-0 z-50 pointer-events-none">
        <span>9:41</span>
        <div className="flex space-x-1.5 items-center">
           <List size={12} className="rotate-90" />
           <Phone size={12} />
           <div className="w-5 h-2.5 bg-black rounded-md relative flex items-center px-0.5">
             <div className="w-full h-[6px] bg-white/40 rounded-sm"></div>
           </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      {/* Persistent Bottom Nav */}
      {showFooter && (
        <div className="bg-white/90 backdrop-blur-2xl border-t border-gray-100 flex justify-around items-center py-5 px-6 pb-9 rounded-b-[3rem] absolute bottom-0 left-0 right-0 z-40">
          <button onClick={() => setView('HOME')} className={`flex flex-col items-center group ${view === 'HOME' ? 'text-orange-500' : 'text-gray-300'}`}>
            <Home size={24} className={`${view === 'HOME' ? 'fill-current' : 'group-hover:text-gray-500'}`} />
            <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Explore</span>
          </button>
          <button onClick={() => setView('ORDER_HISTORY')} className={`flex flex-col items-center group ${view === 'ORDER_HISTORY' ? 'text-orange-500' : 'text-gray-300'}`}>
            <History size={24} className={`${view === 'ORDER_HISTORY' ? '' : 'group-hover:text-gray-500'}`} />
            <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Orders</span>
          </button>
          <button onClick={() => setView('ORDER_TRACKING')} className={`flex flex-col items-center group ${view === 'ORDER_TRACKING' ? 'text-orange-500' : 'text-gray-300'}`}>
            <MapIcon size={24} className={`${view === 'ORDER_TRACKING' ? '' : 'group-hover:text-gray-500'}`} />
            <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Track</span>
          </button>
          <button onClick={() => setView('PROFILE')} className={`flex flex-col items-center group ${view === 'PROFILE' ? 'text-orange-500' : 'text-gray-300'}`}>
            <User size={24} className={`${view === 'PROFILE' ? 'fill-current' : 'group-hover:text-gray-500'}`} />
            <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">Profile</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomerApp;
