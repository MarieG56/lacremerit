import { useApi } from "../hooks/useApi";

const api = useApi();

export interface Client {
  id: number;
  name: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  contactInfo?: { id: number; name: string };
}

export async function getClient(id: number) {
    try {
        const response = await api.get(`/clients/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function getAllClients() {
    try {
        const response = await api.get(`/clients`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function postClient(body: Partial<Client>) {
    try {
        const response = await api.post("/clients", body);
        console.log("response", response);
        console.log("body", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function updateClient(id: number, body: Partial<Client>) {
    try {
        const response = await api.patch(`/clients/${id}`, body);
        console.log("response", response);
        console.log("body", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function deleteClient(id: number) {
    try {
        const response = await api.delete(`/clients/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}
