import { useApi } from "../hooks/useApi";

const api = useApi();

export type Category = {
    id: number;
    name: string;
};

export async function getCategory(id: number) {
  try {
      const response = await api.get(`/category/${id}`);
      return response;
  } catch (error) {
      console.error("Error", error);
  }
}

export async function getAllCategories() {
    try {
        const response = await api.get(`/categories`);
        return response;
    } catch (error) {
        console.error("Error", error);
    }
}

export async function postCategory(body: Partial<Category>) {
  try {
      const response = await api.post("/categories", body);
      console.log("response", response);
      console.log("body", body);
      return response;
  } catch (error) {
      console.error("Error", error);
  }
}

export async function updateCategory(id: number, body: Partial<Category>) {
  try {
      const response = await api.patch(`/categories/${id}`, body);
      console.log("response", response);
      console.log("body", body);
      return response;
  } catch (error) {
      console.error("Error", error);
  }
}

export async function deleteCategory(id: number) {
  try {
      const response = await api.delete(`/categories/${id}`);
      return response;
  } catch (error) {
      console.error("Error", error);
  }
}