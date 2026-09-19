export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  categoryName: string;
  image: string | null;
  stock: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string | null;
  productCategoryName: string | null;
  productPrice: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  totalItemCount: number;
}

export type UserRole = 'Admin' | 'User';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

export type CartState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: Cart };

export interface LoginResponse {
  token: string;
  user: User;
}