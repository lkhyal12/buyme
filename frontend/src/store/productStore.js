import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProducteStore = create((set, get) => ({
  products: [],
  loading: false,
  createProduct: async (newProduct) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/products", newProduct);

      set((prevState) => ({
        ...prevState,
        products: [...prevState.products, response.data.products],
        loading: false,
      }));
      return { success: true };
    } catch (err) {
      const errMsg =
        err?.response?.data?.message || err?.message || "Something went wrong";
      toast.error(errMsg);
      set({ loading: false });
      return { success: false };
    }
  },
}));
