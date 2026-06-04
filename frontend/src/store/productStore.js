import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { getErrorMsg } from "../lib/utils";

export const useProducteStore = create((set, get) => ({
  products: [],
  loading: false,
  createProduct: async (newProduct) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.post("/products", newProduct);

      set((prevState) => ({
        ...prevState,
        products: [...prevState.products, response.data.product],
        loading: false,
      }));
      return { success: true };
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
      set({ loading: false });
      return { success: false };
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true });

    try {
      const response = await axiosInstance.delete(`/products/${id}`);

      set((prevState) => ({
        products: prevState.products.filter((p) => p._id !== id),
        loading: false,
      }));
      toast.success("Product deleted successfully");
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
    }
  },

  toggleFeaturedProduct: async (id) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.patch(`/products/${id}`);
      console.log(response);
      set((prevState) => ({
        products: prevState.products.map((product) =>
          product._id === id
            ? { ...product, isFeatured: response.data.product.isFeatured }
            : product,
        ),
      }));
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
    } finally {
      set({ loading: false });
    }
  },

  fetchAllProducts: async () => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get("/products");
      set({ products: response.data.products, loading: false });
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong ";
      toast.error(errorMsg);
      set({ loading: false });
    }
  },

  // fecth products by category
  fetchProductsByCategory: async (category) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(
        `/products/category/${category}`,
      );
      set({ products: response.data.products, loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
      set({ loading: false });
    }
  },
}));
