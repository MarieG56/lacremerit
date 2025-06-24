import { useApi } from "../hooks/useApi";

const api = useApi();

export interface ProductHistory {
    id?: number;
    productId: number;
    price?: number;
    weekStartDate: string | Date;
    receivedQuantity: number; 
    soldQuantity: number
    unsoldQuantity: number; 
    description: string; 
}


export async function getProductHistory(id: number) {
    try {
        const response = await api.get(`/product-history/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function getAllProductsHistory() {
    try {
        const response = await api.get(`/product-history`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function postProductHistory(body: Partial<ProductHistory>) {
    try {
        const response = await api.post("/product-history", body);
        console.log("response", response);
        console.log("body", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function updateProductHistory(id: number, body: Partial<ProductHistory>) {
    try {
        const response = await api.patch(`/product-history/${id}`, body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function deleteProductHistory(id: number) {
    try {
        const response = await api.delete(`/product-history/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}
