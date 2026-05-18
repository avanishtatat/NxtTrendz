import Cart from "../models/Cart.js";

export const clearCartFunc = async (userId) => {
    try {
        await Cart.findOneAndUpdate({userId}, 
            {items: []},
            {new: true}
        );
    } catch (error) {
        console.error("Error clearing cart:", error.message);
        throw new Error("An error occurred while clearing the cart.");
    }
}

export const getCart = async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await Cart.findOne({ userId: id });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found for the user." });
    }
    if (cart.items.length === 0) {
      return res.status(200).json({ message: "Cart is empty.", cartList: [] });
    }
    return res.status(200).json({ cartList: cart.items });
  } catch (error) {
    console.error("Error fetching cart:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching the cart." });
  }
};

export const addItemToCart = async (req, res) => {
  const { id } = req.user;
  const { id: productId, title, brand, price, imageUrl, rating } = req.body;
  if (!productId || !title || !brand || price === undefined || !imageUrl) {
    return res.status(400).json({ error: "All product fields are required." });
  }
  try {
    const quantity = 1;
    const updatedCart = await Cart.findByIdAndUpdate(
      { userId: id, "items.productId": productId },
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );
    let cart = updatedCart;
    // If the product was not already in the cart, add it as a new item
    if (!updatedCart) {
      cart = await Cart.findByIdAndUpdate(
        { userId: id },
        {
          $push: {
            items: {
              productId,
              title,
              brand,
              price,
              imageUrl,
              rating,
              quantity,
            },
          },
        },
        { upsert: true, new: true },
      );
    }
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    return res
      .status(200)
      .json({
        cartList: cart.items,
        totalAmount,
        totalItems: cart.items.length,
      });
  } catch (error) {
    console.error("Error adding item to cart:", error.message);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the item to the cart." });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.user;
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 0) {
    return res
      .status(400)
      .json({ error: "Cannot update cart. Some error occurred." });
  }
  try {
    let cart;
    if (quantity === 0) {
      cart = await Cart.findByIdAndUpdate(
        { userId: id },
        { $pull: { items: { productId } } },
        { new: true },
      );
    }
    // If quantity is greater than 0, update the quantity of the existing item
    else {
      cart = await Cart.findByIdAndUpdate(
        { userId: id, "items.productId": productId },
        { $set: { "items.$.quantity": quantity } },
        { new: true },
      );
    }
    const totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    return res
      .status(200)
      .json({
        cartList: cart.items,
        totalAmount,
        totalItems: cart.items.length,
      });
  } catch (error) {
    console.error("Error updating item in cart:", error.message);
    return res
      .status(500)
      .json({
        error: "An error occurred while updating the item in the cart.",
      });
  }
};

export const removeItem = async (req, res) => {
    const { id } = req.user; 
    const { productId } = req.body;
    if (!productId) {
        return res.status(400).json({ error: "Cannot remove item from cart" });
    }
    try {
        const cart  = await Cart.findByIdAndUpdate(
            { userId: id },
            { $pull: { items: { productId } } },
            { new: true },
        );
        const totalAmount = cart.items.reduce(
            (total, item) => total + item.price * item.quantity,
            0,
        );
        return res.status(200).json({ 
            cartList: cart.items,
            totalAmount,
            totalItems: cart.items.length,
         });
     } catch (error) {
         console.error("Error removing item from cart:", error.message);
         return res.status(500).json({ error: "An error occurred while removing the item from the cart." });
    }
}

export const clearCart = async (req, res) => {
    const { id } = req.user;
    try {
        const cart = await clearCartFunc(id);
        return res.status(200).json({ 
            cartList: cart.items,
            totalAmount: 0,
            totalItems: 0,
         });
    } catch (error) {
        console.error("Error clearing cart:", error.message);
        return res.status(500).json({ error: "An error occurred while clearing the cart." });
    }
}
