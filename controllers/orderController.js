const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, address, phone } = req.body;

    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }

    let totalPrice = 0;
    let orderProducts = [];

    // Kiểm tra sản phẩm và tính tổng tiền
    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Sản phẩm ID ${item.product} không tồn tại` });
      }

      if (product.quantity < item.quantity) {
        return res
          .status(400)
          .json({ message: `Sản phẩm ${product.name} không đủ hàng` });
      }

      totalPrice += product.price * item.quantity;
      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        image: product.image,
      });
      console.log(orderProducts);

      // Cập nhật số lượng sản phẩm trong kho
      product.quantity -= item.quantity;
      await product.save();
    }

    // Tạo đơn hàng
    const newOrder = new Order({
      user: userId,
      products: orderProducts,
      totalPrice,
      address,
      phone,
      status: "Pending",
    });
    await newOrder.save();
    res.status(201).json({ message: "Đơn hàng đã được tạo", order: newOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo đơn hàng", error: error.message });
  }
};

// Lấy danh sách tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      // Lấy thông tin người dùng đặt hàng (name, email)
      .populate("user", "name email")
      // Lấy thông tin sản phẩm trong đơn (name, price, image)
      .populate("products.product", "name price image");

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

// Lấy tất cả đơn hàng theo ID User
exports.getOrderByUserId = async (req, res) => {
  try {
    const ordersUser = await Order.find({ user: req.params.userId })
      .populate("user", "name email")
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo mới nhất
    
    if (!ordersUser || ordersUser.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng nào của user này" });
    }
    res.status(200).json(ordersUser);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
  }
};

// Lấy chi tiết đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("products.product", "name price");
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    res.status(200).json(order);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy đơn hàng", error: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    order.status = status;
    await order.save();
    res
      .status(200)
      .json({ message: "Cập nhật trạng thái đơn hàng thành công", order });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái đơn hàng",
      error: error.message,
    });
  }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }
    res.status(200).json({ message: "Xóa đơn hàng thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi xóa đơn hàng", error: error.message });
  }
};
