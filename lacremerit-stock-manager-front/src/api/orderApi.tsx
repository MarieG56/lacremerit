import { useApi } from "../hooks/useApi";
import { OrderItemUpdate } from "./orderItemApi";

export type Unit = "KG" | "L" | "UN";

// Post orderItem
export type OrderItemCreateInput = {
  productId: number;
  quantity: number;
  unitPrice: number;
};

// Get orderItem
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  unit: Unit;
  product?: {
    name: string;
    unit: Unit;
  };
}

// Get order
export interface Order {
  id: number;
  customerId?: number;
  clientId?: number; 
  customer?: {
    name: string;
  };
  client?: {
    name: string;
  }; 
  orderDate: string;
  status: string;
  totalAmount: number;
  orderItems?: OrderItem[];
}

// Post order
export interface OrderCreateInput {
  customerId?: number; 
  clientId?: number;   
  orderDate?: string;
  status?: string;
  totalAmount: number;
  orderItems?: OrderItemCreateInput[];
}

export type OrderUpdate = {
  status?: string;
  customerId?: number;
  clientId?: number; 
  totalAmount?: number;
  orderItems?: OrderItemUpdate[];
};

const api = useApi();

export async function getOrder(id: number) {
  try {
    const response = await api.get(`/orders/${id}`);
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function getAllOrders() {
  try {
    const response = await api.get(`/orders`);
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function postOrder(body: OrderCreateInput) {
  try {
    const response = await api.post("/orders", body);
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function updateOrder(id: number, body: OrderUpdate) {
  try {
    const response = await api.patch(`/orders/${id}`, body);
    console.log("Réponse PATCH :", response?.data);
    return response;
  } catch (error) {
    console.error("Error", error);
    throw error;
  }
}

export async function deleteOrder(id: number) {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

// This function is used to filter and map order items
export function processOrderItems(editValues: any) {
  return editValues?.orderItems
    ?.filter((item: any) => typeof item.productId === "number")
    .map((item: any) => ({
      productId: item.productId as number,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
    }));
}