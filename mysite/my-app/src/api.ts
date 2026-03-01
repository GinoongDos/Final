import axios from "axios";
import {
  Customer,
  Product,
  Order,
  OrderWrite,
  OrderItem,
} from "./types";

const API = axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

/** DRF may return paginated lists as { results: T[] }. Normalize to always return an array. */
function unwrapList<T>(data: T[] | { results?: T[] }): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object" && "results" in data && Array.isArray((data as { results: T[] }).results))
    return (data as { results: T[] }).results;
  return [];
}

// ——— CUSTOMERS ———
export const getCustomers = async (): Promise<Customer[]> => {
  const response = await API.get<Customer[] | { results: Customer[] }>("customers/");
  return unwrapList(response.data);
};

export const createCustomer = async (
  data: Omit<Customer, "id">
): Promise<Customer> => {
  const response = await API.post<Customer>("customers/", data);
  return response.data;
};

export const updateCustomer = async (
  id: number,
  data: Partial<Customer>
): Promise<Customer> => {
  const response = await API.put<Customer>(`customers/${id}/`, data);
  return response.data;
};

export const deleteCustomer = async (id: number): Promise<void> => {
  await API.delete(`customers/${id}/`);
};

// ——— PRODUCTS ———
export const getProducts = async (): Promise<Product[]> => {
  const response = await API.get<Product[] | { results: Product[] }>("products/");
  return unwrapList(response.data);
};

export const createProduct = async (
  data: Omit<Product, "id">
): Promise<Product> => {
  const response = await API.post<Product>("products/", data);
  return response.data;
};

export const updateProduct = async (
  id: number,
  data: Partial<Product>
): Promise<Product> => {
  const response = await API.put<Product>(`products/${id}/`, data);
  return response.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await API.delete(`products/${id}/`);
};

// ——— ORDERS ———
export const getOrders = async (): Promise<Order[]> => {
  const response = await API.get<Order[] | { results: Order[] }>("orders/");
  return unwrapList(response.data);
};

export const getOrder = async (id: number): Promise<Order> => {
  const response = await API.get<Order>(`orders/${id}/`);
  return response.data;
};

export const createOrder = async (data: OrderWrite): Promise<Order> => {
  const response = await API.post<Order>("orders/", data);
  return response.data;
};

export const updateOrder = async (
  id: number,
  data: Partial<OrderWrite>
): Promise<Order> => {
  const response = await API.put<Order>(`orders/${id}/`, data);
  return response.data;
};

export const deleteOrder = async (id: number): Promise<void> => {
  await API.delete(`orders/${id}/`);
};

// ——— ORDER ITEMS (nested in order write, or add via action) ———
export const addOrderItem = async (
  orderId: number,
  data: { product: number; quantity: number }
): Promise<OrderItem> => {
  const response = await API.post<OrderItem>(
    `orders/${orderId}/items/`,
    data
  );
  return response.data;
};
