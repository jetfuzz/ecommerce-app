export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  categoryName: string;
  image: string | null;
  stock: number;
  // rating: {
  //   rate: number;
  //   count: number;
  // };
}

export interface CartItem {
  product: Product;
  quantity: number;
}
