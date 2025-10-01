// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const morgan = require("morgan");
// const connectDB = require("./config/db");
// const productRouter = require("./routes/productRoute");
// const usersRouter = require("./routes/userRoute");
// const orderRouter = require("./routes/orderRoute");
// const reviewRouter = require("./routes/reviewRoute");
// const { startMBBankJob } = require("./cron/mbbankJob");
// // const { chatbot } = require("./utils/chatbot");
// require("dotenv").config();

// const app = express();
// app.use(bodyParser.json({ limit: "10mb" }));
// app.use(cors());
// app.use(morgan("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // === Socket.IO setup ===
// const server = require("http").createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server, {
//   cors: {
//     origin: "*", // TODO: chỉnh thành domain FE để bảo mật
//     methods: ["GET", "POST"],
//   },
// });
// app.set("io", io);
// mongoose.connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log("✅ Kết nối MongoDB thành công!"))
// .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// // Route test
// app.get("/", (req, res) => {
//     res.send("API chạy ok!");
// });
// const paymentRouter = require("./routes/payment")(io);

// connectDB();

// //API của thằng sản phẩm
// app.use("/api/v1/", productRouter);
// //API của thằng user(login, resgister)
// app.use("/api/v2/", usersRouter);
// //API cuar thành order
// app.use("/api/v3/", orderRouter);
// //API danh gia
// app.use("/api/v4/", reviewRouter);
// //API thanh toán
// app.use("/api/v5/", paymentRouter);

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//   startMBBankJob(app);
// });


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const connectDB = require("./config/db");

const productRouter = require("./routes/productRoute");
const usersRouter = require("./routes/userRoute");
const orderRouter = require("./routes/orderRoute");
const reviewRouter = require("./routes/reviewRoute");
const { startMBBankJob } = require("./cron/mbbankJob");

const app = express();

// Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Socket.IO setup ===
const server = require("http").createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*", // TODO: chỉnh thành domain FE để bảo mật
    methods: ["GET", "POST"],
  },
});
app.set("io", io);

// Kết nối MongoDB
connectDB();

// Route test
app.get("/", (req, res) => {
  res.send("API chạy ok!");
});

// API
app.use("/api/v1/", productRouter);
app.use("/api/v2/", usersRouter);
app.use("/api/v3/", orderRouter);
app.use("/api/v4/", reviewRouter);
const paymentRouter = require("./routes/payment")(io);
app.use("/api/v5/", paymentRouter);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  startMBBankJob(app);
});
