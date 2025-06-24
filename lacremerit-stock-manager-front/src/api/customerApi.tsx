import { useApi } from "../hooks/useApi";

const api = useApi();

export interface Customer {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
}

export async function getCustomer(id: number) {
    try {
        const response = await api.get(`/customers/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function getAllCustomers() {
    try {
        const response = await api.get(`/customers`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function postCustomer(body: Partial<Customer>) {
    try {
        const response = await api.post("/customers", body);
        console.log("response", response);
        console.log("body", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function updateCustomer(id: number, body: Partial<Customer>) {
    try {
        const response = await api.patch(`/customers/${id}`, body);
        console.log("response", response);
        console.log("body", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function deleteCustomer(id: number) {
    try {
        const response = await api.delete(`/customers/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}
