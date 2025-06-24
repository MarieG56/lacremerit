import { useApi } from "../hooks/useApi";

const api = useApi();

export type Unit = "KG" | "L" | "UN";

export interface Product {
    id: number;
    name: string;
    unit: Unit;
    description?: string;
    categoryId?: number; // utilisé pour POST/PATCH
    category?: { id: number; name: string }; // utilisé pour GET
    subcategoryId?: number; // utilisé pour POST/PATCH
    subcategory?: { id: number; name: string }; // utilisé pour GET
    producerId?: number; // utilisé pour POST/PATCH
    producer?: { id: number; name: string }; // utilisé pour GET
    isActive?: boolean;
}

export async function getProduct(id: number) {
    try {
        const response = await api.get(`/products/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function getAllProducts() {
    try {
        const response = await api.get(`/products`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function postProduct(body: Partial<Product>) {
    try {
        const response = await api.post("/products", body);
        console.log("response", response);
        console.log("body", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function updateProduct(id: number, body: Partial<Product>) {
    try {
        const response = await api.patch(`/products/${id}`, body);
        console.log("response", response);
        console.log("body", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function deleteProduct(id: number) {
    try {
        const response = await api.delete(`/products/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}
