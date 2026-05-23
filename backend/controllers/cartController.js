import ProductModel from "../models/productModel.js";
export const addToCartController = async (req, res) => {
  const productId = req.body.productId;
  const user = req.user;
  try {
    const existingItem = user.cartItems.find(
      (item) => item.product.toString() === productId,
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push({
        quantity: 1,
        product: productId,
      });
    }
    await user.save();
  } catch (err) {
    console.log("error in add to cart controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// remove all products from cart
export const removeAllFromCart = async (req, res) => {
  const { productId } = req.body;
  const user = req.user;
  try {
    if (!productId) user.cartItems = [];
    else {
      user.cartItems = user.cartItems.filter(
        (item) => item.product !== productId,
      );
    }
    await user.save();
    return res.status(200).json({
      message: "Products removed from cart successfullt",
      products: user.cartItems,
    });
  } catch (err) {
    console.log("error in the removeAllfrom cart controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// update quantity controller
export const updateQuantity = async (req, res) => {
  const { id: productId } = req.params;
  const quantity = req.body.quantity;
  const { user } = req;
  try {
    const existingItem = user.cartItems.find(
      (item) => item.product === productId,
    );
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    } else {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (item) => item.product !== productId,
        );
      } else existingItem.quantity = quantity;
      await user.save();
      return res
        .status(200)
        .json({
          message: "Product count updated successfully",
          products: user.cartItems,
        });
    }
  } catch (err) {
    console.log("error in the updatequantity controller ", err);
    return res.status(500).json({ message: "Server error" });
  }
};
