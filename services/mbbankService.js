const axios = require("axios");
const Order = require("../models/orderModel");

const PAYMENT_TOKEN = process.env.PAYMENT_TOKEN;
let isRunning = false;

async function checkMBTransactions(app) {
  if (isRunning) return;
  isRunning = true;

  try {
    const io = app.get("io");

    const url = `https://api.sieuthicode.net/historyapimbbankv2/${PAYMENT_TOKEN}`;
    const response = await axios.get(url);

    const transactions = response.data?.transactions || [];
    const pendingOrders = await Order.find({ status: "Pending" });

    const now = Date.now();

    for (const order of pendingOrders) {
      const match = transactions.find((tx) => {
        const desc = (tx.description || "").toString();
        const amount = Number(tx.amount || 0);

        // Regex: PAYxxxxxxxSHOP (8 hex), cho phép có dấu chấm sau SHOP
        const regex = /PAY[\s\-_\.]*(([0-9a-fA-F][\s\-_\.]*){8})SHOP[\.]?/i;
        const found = desc.match(regex);

        let txPaymentId = found ? `PAY${found[1]}SHOP` : null;

        if (txPaymentId) {
          // Chuẩn hóa: bỏ khoảng trắng, dấu . - _
          txPaymentId = txPaymentId.replace(/[\s\-_\.]+/g, "").toLowerCase();
        }

        const orderPaymentId = order.paymentId
          ? order.paymentId.replace(/[\s\-_\.]+/g, "").toLowerCase()
          : null;

        return txPaymentId === orderPaymentId;
      });

      if (match) {
        const fresh = await Order.findById(order._id);
        if (fresh && fresh.status === "Pending") {
          fresh.status = "Paid";
          await fresh.save();

          io.emit("paymentSuccess", {
            paymentId: order.paymentId,
            orderId: order._id,
            amount: order.totalPrice,
          });
        }
      } else {
        // kiểm tra hết hạn 5 phút
        const createdAt = new Date(order.createdAt).getTime();
        if (now - createdAt > 5 * 60 * 1000) {
          order.status = "Cancelled";
          await order.save();

          io.emit("paymentTimeout", {
            paymentId: order.paymentId,
            orderId: order._id,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error in checkMBTransactions:", err.message || err);
  } finally {
    isRunning = false;
  }
}

module.exports = { checkMBTransactions };
