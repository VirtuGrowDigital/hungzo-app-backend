import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// add to cart
export const addToCart = async (req, res) => {
    try {
      const userId = req.user.id;
      const { productId, varietyId, quantity = 1 } = req.body;
  
      if (!productId || !varietyId) {
        return res.status(400).json({ message: "Product and varietyId are required" });
      }
  
      if (quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
      }
  
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });
  
      const variety = product.varieties.id(varietyId);
      if (!variety) return res.status(404).json({ message: "Variety not found" });
  
      if (!variety.isAvailable) {
        return res.status(400).json({ message: "This item is currently unavailable" });
      }
  
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }
  
      const existingItem = cart.items.find(
        (item) =>
          item.product.toString() === productId &&
          item.varietyId.toString() === varietyId
      );
  
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, varietyId, quantity });
      }
  
      await cart.save();
  
      res.json({ success: true, message: "Added to cart", cart });
    } catch (error) {
      console.error("Add to Cart Error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  


// Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    if (!cart) return res.json({ success: true, items: [] });

    // Combine product + variety details for frontend
    const detailedItems = cart.items.map((item) => {
      const product = item.product;
      const variety = product?.varieties.id(item.varietyId);

      return {
        productId: product._id,
        productName: product.name,
        category: product.category,
        image: product.images[0],
        variety: variety
          ? {
              id: variety._id,
              name: variety.name,
              price: variety.price,
              isAvailable: variety.isAvailable,
            }
          : null,
        quantity: item.quantity,
        totalPrice: variety ? variety.price * item.quantity : 0,
      };
    });

    res.json({ success: true, items: detailedItems });
  } catch (error) {
    console.error("Get Cart Error:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};


// Remove item
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, varietyId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (i) =>
        i.product.toString() !== productId ||
        i.varietyId.toString() !== varietyId
    );

    await cart.save();

    res.json({ success: true, message: "Item removed from cart", cart });
  } catch (error) {
    console.error("Remove Cart Error:", error);
    res.status(500).json({ message: "Error removing item", error });
  }
};

