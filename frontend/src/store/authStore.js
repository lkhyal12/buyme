import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { getErrorMsg } from "../lib/utils";
export const useAuthStore = create((set, get) => ({
  user: null,
  isCheckingAuth: true,
  loading: false,
  error: null,
  accessToken: null,
  signUp: async (name, email, password, confrimPassword) => {
    set({ loading: true });
    if (password !== confrimPassword) {
      set({ loading: false, error: null });
      return toast.error("Passwords don not match");
    }
    try {
      await new Promise((res) => setTimeout(() => res(), 1500));
      const response = await axiosInstance.post("/auth/sign-up", {
        name,
        email,
        password,
      });
      set({
        user: response.data.user,
        accessToken: response.data.accessToken,
        error: null,
      });
      return { success: true };
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
      set({
        error: errMsg,
      });
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  // login function
  login: async (email, password) => {
    set({ loading: true });
    if (!email || !password) {
      set({ loading: false });
      return toast.error("email and password are required");
    }
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      set({
        user: response.data.user,
        accessToken: response.data.accessToken,
        loading: false,
      });
      return { success: true };
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
      set({
        error: errMsg,
        loading: false,
        user: null,
        accessToken: null,
      });
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  // logout function
  logout: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/auth/logout");
      set({ user: null });
      return { success: true };
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
      return { success: false };
    } finally {
      set({ loading: false });
    }
  },

  // checkauth function
  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/profile", {
        headers: {
          Authorization: `Bearer ${get().accessToken}`,
        },
      });
      console.log({ response });
      set({ user: response.data.user });
      return { success: true };
    } catch (err) {
      console.log(err);
      set({ user: null });
      return { success: false };
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
