export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
}

export interface OrderItem {
  id: number;
  order: number;
  product: number;
  product_name: string;
  product_price: string;
  quantity: number;
}

export interface OrderItemWrite {
  product: number;
  quantity: number;
}

export interface Order {
  id: number;
  customer: number;
  customer_name: string;
  order_date: string;
  items: OrderItem[];
  total: string;
}

export interface OrderWrite {
  customer: number;
  items?: OrderItemWrite[];
}
