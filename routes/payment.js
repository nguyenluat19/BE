const express = require("express");
const QRCode = require("qrcode");
const Order = require("../models/orderModel");
const { checkMBTransactions } = require("../services/mbbankService");
const uuidv4 = (...args) => import("uuid").then(({ v4 }) => v4(...args));

const BANK_CONFIG = {
  bank: "MB",
  account: process.env.MB_ACCOUNT,
  accountName: process.env.MB_ACCOUNT_NAME,
};

module.exports = (io) => {
  const router = express.Router();

  // Tạo đơn hàng và trả về QR Code
  router.post("/create-payment", async (req, res) => {
    const { amount, userId, products, address, phone } = req.body;
    try {
      const uuidPart = (await uuidv4()).replace(/-/g, "").slice(0, 8);
      const suffix = "SHOP"; // chuỗi cố định phía sau
      const paymentId = `PAY${uuidPart}${suffix}`;
      const transferContent = paymentId;

      const vietQRUrl = `https://img.vietqr.io/image/${BANK_CONFIG.bank}-${BANK_CONFIG.account}-compact.png?amount=${amount}&addInfo=${transferContent}&accountName=${BANK_CONFIG.accountName}`;
      const qrCodeDataURL = await QRCode.toDataURL(vietQRUrl);

      const order = await Order.create({
        user: userId,
        // name: req.body.name,
        products: products.map((p) => ({
          product: p.product,
          quantity: p.quantity,
          price: p.price,
        })),
        totalPrice: amount,
        address,
        phone,
        status: "Pending",
        paymentId,
        paymentMethod: "BankTransfer",
      });
      return res.json({
        orderId: order._id,
        paymentId,
        vietQRUrl,
        qrCodeUrl: qrCodeDataURL,
        bankInfo: {
          bank: "MBBank",
          account: BANK_CONFIG.account,
          accountName: BANK_CONFIG.accountName,
          amount,
          content: transferContent,
        },
      });
    } catch (e) {
      console.error("create-payment error:", e);
      return res.status(500).json({ error: e.message });
    }
  });

  // Admin/manual trigger scan MB Bank
  router.get("/scan-now", async (req, res) => {
    try {
      await checkMBTransactions(io);
      return res.json({ success: true, message: "Scan executed" });
    } catch (e) {
      console.error("scan-now error:", e);
      return res.status(500).json({ success: false, error: e.message });
    }
  });

  return router;
};
