
import { Restaurant, Order } from './types';

export const DUMMY_RESTAURANTS: Restaurant[] = [
  {
    id: 'res-1',
    name: 'Burger Palace',
    rating: 4.8,
    deliveryTime: '20-30 min',
    image: 'https://picsum.photos/seed/burger/400/300',
    cuisine: 'American • Burgers',
    menu: [
      { id: 'm1', name: 'Classic Cheeseburger', price: 8.99, category: 'Main', image: 'https://picsum.photos/seed/cb/100/100', description: 'Juicy beef patty with aged cheddar.' },
      { id: 'm2', name: 'Bacon Deluxe', price: 10.99, category: 'Main', image: 'https://picsum.photos/seed/bd/100/100', description: 'Double bacon with secret sauce.' },
      { id: 'm3', name: 'French Fries', price: 3.99, category: 'Sides', image: 'https://picsum.photos/seed/ff/100/100', description: 'Crispy golden potato fries.' },
    ]
  },
  {
    id: 'res-2',
    name: 'Sushi Zen',
    rating: 4.9,
    deliveryTime: '35-45 min',
    image: 'https://picsum.photos/seed/sushi/400/300',
    cuisine: 'Japanese • Seafood',
    menu: [
      { id: 'm4', name: 'Salmon Nigiri', price: 12.99, category: 'Sushi', image: 'https://picsum.photos/seed/sn/100/100', description: 'Fresh salmon on vinegared rice.' },
      { id: 'm5', name: 'Dragon Roll', price: 14.99, category: 'Rolls', image: 'https://picsum.photos/seed/dr/100/100', description: 'Eel and cucumber topped with avocado.' },
    ]
  },
  {
    id: 'res-3',
    name: 'Pasta Fresca',
    rating: 4.7,
    deliveryTime: '25-35 min',
    image: 'https://picsum.photos/seed/pasta/400/300',
    cuisine: 'Italian • Pasta',
    menu: [
      { id: 'm6', name: 'Carbonara', price: 11.50, category: 'Pasta', image: 'https://picsum.photos/seed/car/100/100', description: 'Creamy egg sauce with guanciale.' },
      { id: 'm7', name: 'Tiramisu', price: 6.99, category: 'Desserts', image: 'https://picsum.photos/seed/tm/100/100', description: 'Classic Italian coffee dessert.' },
    ]
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-5421',
    customerName: 'John Doe',
    restaurantName: 'Burger Palace',
    items: [DUMMY_RESTAURANTS[0].menu[0]],
    total: 8.99,
    status: 'pending',
    timestamp: '10:45 AM'
  },
  {
    id: 'ORD-9902',
    customerName: 'Sarah Smith',
    restaurantName: 'Sushi Zen',
    items: [DUMMY_RESTAURANTS[1].menu[0]],
    total: 12.99,
    status: 'preparing',
    timestamp: '10:50 AM'
  }
];
