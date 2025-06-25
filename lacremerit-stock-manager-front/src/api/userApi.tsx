import { useApi } from "../hooks/useApi";
import { setAccessToken } from "../hooks/useApi"; 

const api = useApi();

export type User = {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
};

export async function getUser(id: number) {
  try {
    const response = await api.get(`/user/${id}`);
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function getAllUsers() {
  try {
    const response = await api.get(`/user`);
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function postUser(body: Partial<User>) {
  try {
    const response = await api.post("/user", body);
    console.log("response", response);
    console.log("body", body);
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function updateUser(id: number, body: Partial<User>) {
  try {
    const response = await api.patch(`/user/${id}`, body);
    console.log("response", response);
    console.log("body", body);
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function deleteUser(id: number) {
  try {
    const response = await api.delete(`/user/${id}`);
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function loginUser(body: { email: string; password: string }) {
  try {
    const response = await api.post("/auth/login", body, { withCredentials: true });
    if (response?.data?.access_token) {
      setAccessToken(response.data.access_token); 
    }
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}

export async function refreshToken() {
  try {
    const response = await api.post("/auth/refresh", {}, { withCredentials: true });
    if (response?.data?.access_token) {
      setAccessToken(response.data.access_token);
    }
    return response;
  } catch (error) {
    console.error("Error", error);
  }
}