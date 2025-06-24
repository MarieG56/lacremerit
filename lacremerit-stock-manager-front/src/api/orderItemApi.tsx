import { useApi } from "../hooks/useApi";
import { Product } from "./productApi";

const api = useApi();

export type Unit = "KG" | "L" | "UN";

export type OrderItemPost = {
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    unit: Unit;
};

export type OrderItemUpdate = {
    productId?: number;
    quantity?: number;
    unitPrice?: number;
};

export interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    product?: Product
}

export async function getOrderItem(id: number) {
    try {
        const response = await api.get(`/order-item/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function getAllOrderItems() {
    try {
        const response = await api.get(`/order-item`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function postOrderItem(body: Partial<OrderItemPost>) {
    try {
        const response = await api.post("/order-item", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function updateOrderItem(id: number, body: Partial<OrderItemUpdate>) {
    try {
        const response = await api.patch(`/order-item/${id}`, body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function deleteOrderItem(id: number) {
    try {
        const response = await api.delete(`/order-item/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}
