import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getErrorMsg } from "../lib/utils";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,

  getCartItems: async () => {
    try {
      const response = await axiosInstance.get("/cart");
      console.log("cart", response);
      set({ cart: response.data.cartItems });
      get().calculateTotal();
      return { success: false };
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
      return { success: false };
    }
  },
  addToCart: async (product) => {
    console.log("prodddd");
    try {
      const response = await axiosInstance.post("/cart", {
        productId: product._id,
      });
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id,
        );
        const newCart = existingItem
          ? prevState.cart.map((el) =>
              el._id === product._id
                ? { ...el, quantity: el.quantity + 1 }
                : el,
            )
          : [...prevState.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });
      toast.success("Product added successfully");
      get().calculateTotal();
      console.log({ response });
      return { success: true };
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
      return { success: false };
    }
  },
  //   calculate total function
  calculateTotal: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce((acc, el) => acc + el.total * el.quantity, 0);
    let total = subTotal;
    if (coupon) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }

    set({ total, subTotal });
  },
}));
