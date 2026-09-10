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
  product: Product;
  quantity: number;
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
