export interface User { 
  id: string; 
  name: string; 
  email: string; 
  role: 'customer' | 'admin'; 
}

export interface Product { 
  id: string; 
  name: string; 
  slug: string; 
  description: string; 
  price: number; 
  originalPrice?: number;
  onSale?: boolean;
  badge?: string;
  category: string; 
  brand?: string;
  model?: string;
  color?: string;
  imageUrl: string; 
  stock: number; 
  featured: boolean; 
}

export interface CartItem { 
  product: Product; 
  quantity: number; 
}
