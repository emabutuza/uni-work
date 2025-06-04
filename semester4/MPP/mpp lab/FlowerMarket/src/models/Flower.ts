import { ImageSourcePropType } from 'react-native';

export interface Flower {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: ImageSourcePropType;
  brand: string;
  event?: 'Wedding' | 'Anniversaries' | 'Holidays' | 'Other';
  createdAt: Date;
  inStock: boolean;
  color: string;
  size: string;
  rating: number;
}

export type FlowerFormData = Omit<Flower, 'id'>;

export interface CartItem {
  flower: Flower;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: string;
  deliveryMethod: string;
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: Date;
} 