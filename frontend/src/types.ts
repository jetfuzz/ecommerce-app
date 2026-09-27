export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  categoryName: string;
  categoryId: number;
  image: string | null;
  stock: number;
}

export interface CreateProductPayload {
  title: string;
  price: number;
  description: string;
  categoryId: number;
  image: string | null;
  stock: number;
}

export interface Category {
  id: number;
  name: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  totalItemCount: number;
}

export interface CartItem {
  id: number;
  productId: number;
  productTitle: string;
  productImage: string | null;
  productCategoryName: string | null;
  productPrice: number;
  quantity: number;
  productStock: number;
}

export type CartState = { status: 'idle' } | AsyncState<Cart>;

export type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; data: T };

export interface User {
  id: number;
  username: string;
  role: UserRole;
}

export type UserRole = 'Admin' | 'User';

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface AuthContextType extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Order {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

export type OrderStatus =
  'Pending' | 'Paid' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface OrderItem {
  id: number;
  productId: number | null;
  productTitle: string;
  productImage: string | null;
  quantity: number;
  priceAtPurchase: number;
}
