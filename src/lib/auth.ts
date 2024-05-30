import { useAuthStore } from "@/store/auth";
import axiosInstance from "./axios";

const login = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    const { accessToken } = response.data;
    const { saveUser } = useAuthStore.getState();
    saveUser({ email, roles: [], accessToken });
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const getRoles = async () => {
  try {
    const response = await axiosInstance.get("/user");
    const { roles } = response.data;
    const { updateRoles } = useAuthStore.getState();
    updateRoles(roles);
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const register = async (
  email: string,
  password: string,
  passwordRepeat: string
) => {
  try {
    const response = await axiosInstance.post("/auth/register", {
      email,
      password,
      passwordRepeat,
    });
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export { login, register, getRoles };
