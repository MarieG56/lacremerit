import { useApi } from "../hooks/useApi";

const api = useApi();

export interface Producer {
  id: string;
  name: string;
  address?: string;
  email?: string;
  phoneNumber?: string;
  contactInfo?: { id: number; name: string };
}

export async function getProducer(id: number) {
    try {
        const response = await api.get(`/producers/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function getAllProducers() {
    try {
        const response = await api.get(`/producers`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function postProducer(body: Partial<Producer>) {
    try {
        const response = await api.post("/producers", body);
        console.log("response", response);
        console.log("body", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function updateProducer(id: number, body: Partial<Producer>) {
    try {
        const response = await api.patch(`/producers/${id}`, body);
        console.log("response", response);
        console.log("body", body);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function deleteProducer(id: number) {
    try {
        const response = await api.delete(`/producers/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}
