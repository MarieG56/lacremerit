import { useApi } from "../hooks/useApi";

const api = useApi();

export interface Subcategory {
    id: number;
    name: string;
    categoryId?: number; 
    category?: { id: number; name: string }; 
}

export async function getSubcategory(id: number) {
    try {
        const response = await api.get(`/subcategories/${id}`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function getAllSubcategories() {
    try {
        const response = await api.get(`/subcategories`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function postSubcategory(body: { name: string; categoryId: number }) {
  try {
      const response = await api.post("/subcategories", body);
      return response;
  } catch (error) {
      console.error("Error", error);
  }
}

export async function updateSubcategory(id: number, body: Partial<Subcategory>) {
  try {
      const response = await api.patch(`/subcategories/${id}`, body);
      console.log("response", response);
      console.log("body", body);
      return response;
  } catch (error) {
      console.error("Error", error);
  }
}

export async function deleteSubcategory(id: number) {
  try {
      const response = await api.delete(`/subcategories/${id}`);
      return response;
  } catch (error) {
      console.error("Error", error);
  }
}
