import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { getErrorMsg } from "../lib/utils";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subTotal: 0,
  isCouponApplied: false,
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

  // remove from cart
  removeFromCart: async (productId) => {
    try {
      await axiosInstance.delete(`/cart`, {
        data: {
          productId,
        },
      });
      set((prevState) => {
        const newCartProducts = prevState.cart.filter(
          (p) => p._id !== productId,
        );
        return { cart: newCartProducts };
      });
      get().calculateTotal();
      return { success: true };
    } catch (error) {
      const errMsg = getErrorMsg(error);
      toast.error(errMsg);
      return { success: false };
    }
  },
  // update quantity in the backend
  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      await get().removeFromCart(productId);
      return;
    }
    try {
      await axiosInstance.put(`/cart/${productId}`, {
        data: {
          productId,
          quantity,
        },
      });
      set((prevState) => {
        const updatedCartProducts = prevState.cart.map((item) => {
          if (item._id === productId) {
            return { ...item, quantity: quantity };
          }
          return item;
        });
        return { cart: updatedCartProducts };
      });
      get().calculateTotal();
      return { success: true };
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg, { id: "update quantity" });
      return { success: false };
    }
  },
  //   calculate total function
  calculateTotal: () => {
    const { cart, coupon } = get();
    const subTotal = cart.reduce(
      (acc, el) => acc + parseFloat(el.price) * parseInt(el.quantity),
      0,
    );
    let total = subTotal;
    if (coupon) {
      const discount = subTotal * (coupon.discountPercentage / 100);
      total = subTotal - discount;
    }

    set({ total, subTotal });
  },
  clearCart: () => {
    set({
      cart: [],
      total: 0,
      subTotal: 0,
      isCouponApplied: false,
      coupon: false,
    });
  },

  // getCoupon function
  getMyCoupon: async () => {
    try {
      const response = await axiosInstance.get("/coupons");
      set({ coupon: response.data.coupon });
    } catch (err) {
      const errMsg = getErrorMsg(err);
      console.log(errMsg);
    }
  },
  // apply coupon
  applyCoupon: async (code) => {
    try {
      const response = await axiosInstance.post("/coupons/validate", { code });
      set({ coupon: response.data.coupon, isCouponApplied: true });
      get().calculateTotal();
      toast.success("Coupon applied successfully");
    } catch (err) {
      const errMsg = getErrorMsg(err);
      toast.error(errMsg);
      console.log(err);
    }
  },

  // remove coupon
  removeCoupon: async () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotal();
    toast.success("Coupon Removed");
  },
}));
