
export enum AppRole {
  CUSTOMER = 'CUSTOMER',
  RIDER = 'RIDER',
  RESTAURANT = 'RESTAURANT',
  ADMIN = 'ADMIN'
}

export type CustomerView = 
  | 'AUTH_LOGIN' | 'AUTH_OTP' 
  | 'HOME' | 'RESTAURANT_DETAIL' 
  | 'CART' | 'CHECKOUT' 
  | 'ORDER_SUCCESS' | 'ORDER_TRACKING' 
  | 'ORDER_HISTORY' | 'PROFILE';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  image: string;
  cuisine: string;
  menu: MenuItem[];
}

export interface Order {
  id: string;
  customerName: string;
  restaurantName: string;
  items: MenuItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivering' | 'completed';
  timestamp: string;
  riderId?: string;
  location?: { lat: number; lng: number };
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  addresses: string[];
}
