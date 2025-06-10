import axios from "axios";
import { useApi } from "../hooks/useApi";

const api = useApi();

export interface Product {
    id: number;
    name: string;
    unit: string;
    description?: string;
    categoryId?: number; // utilisé pour POST/PATCH
    category?: { id: number; name: string }; // utilisé pour GET/affichage
    subcategoryId?: number; // utilisé pour POST/PATCH
    subcategory?: { id: number; name: string }; // utilisé pour GET/affichage
    producerId?: number; // utilisé pour POST/PATCH
    producer?: { id: number; name: string }; // utilisé pour GET/affichage
    isActive?: boolean;
}

export async function fetchLowStockProducts(): Promise<Product[]> {
    try {
        const response = await axios.get("/api/products/ruptures");

        if (Array.isArray(response.data)) {
            return response.data;
        } else if (
            response.data &&
            typeof response.data === "object" &&
            Array.isArray(response.data.data)
        ) {
            return response.data.data;
        } else {
            console.error("Format inattendu :", response.data);
            return [];
        }
    } catch (error) {
        console.error(
            "Erreur lors de la récupération des produits en rupture :",
            error
        );
        return [];
    }
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
