export interface Flower {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  events: string[];
  rating: number;
  reviews: number;
  createdAt: Date;
}

export interface FlowerFormData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  brand: string;
  events: string[];
  rating: number;
  reviews: number;
} 