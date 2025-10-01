// Backend/routes/orderRoute.js
const express = require("express");
const {
  createOrder,
  getOrderById,
  getOrderByUserId,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const router = express.Router();

router.post("/orders", createOrder);
router.get("/orders/:id", getOrderById);
router.get("/getOrderByUserId/:userId", getOrderByUserId);
router.get("/getAllOrder", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.delete("/delete/order/:id", deleteOrder);

module.exports = router;
