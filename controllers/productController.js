const productModel = require("../models/productModel");
const Product = require("../models/productModel");

//Tạo mới sản phẩm
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(200).json({
      message: "Tạo sản phẩm mới thành công",
      savedProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(400).json({
      message: "Lỗi khi tạo sản phẩm mới",
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({ message: "Không có bất kỳ sản phẩm nào" });
    }

    return res.status(200).json(products);
  } catch (error) {
    return res.status(400).json({
      message: "Lỗi khi get all products",
      error: error.message,
    });
  }
};

//Cấu hình phân trang (ví dụ chỉ lấy 5 hoặc 10 sản phẩm để hiển thị lên trang web);
const getListProducts = async (req, res) => {
  try {
    const perPage = 4;
    const page = req.params.page ? req.params.page : 1;
    const products = await Product.find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Loi khi get list products",
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const productExist = await Product.findById(id);
    if (!productExist) {
      res.status(404).json({ message: "Không tồn tại sản phẩm nào có id này" });
    }
    res.status(200).json(productExist);
  } catch (error) {
    return res.status(400).json({
      message: "Lỗi khi getProductById",
      error: error.message,
    });
  }
};

const updateAllProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productExist = await Product.findById(id);
    if (!productExist) {
      res.status(404).json({ message: "Không thể update sản phẩm" });
    }
    const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ updateProduct });
  } catch (error) {
    return res.status(400).json({
      message: "Lỗi khi update Product",
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const productExist = await Product.findById(id);
    if (!productExist) {
      return res.status(404).json({ message: "Khoong thể xóa sản phẩm" });
    }
    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "xoa san pham thanh cong" });
  } catch (error) {
    res.status(400).json({
      message: "Lỗi khi xóa sản phẩm",
      error: error.message,
    });
  }
};

//Tìm kiếm sản phẩm
const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.query;
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({
      message: "Lỗi khi tìm kiếm sản phẩm",
      error: error.message,
    });
  }
};

const demSoLuongSP = async (req, res) => {
  try {
    const productCount = await Product.countDocuments();

    res.status(200).send({
      products: productCount,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Lỗi không thể đếm số lượng sản phẩm",
    });
  }
};
const getSingleProductController = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message,
    });
  }
};
const getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({
      success: true,
      latestProducts,
    });
  } catch (error) {
    res.status(400).json({
      message: "Lỗi khi lấy sản phẩm mới nhất",
      error: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getListProducts,
  getProductById,
  updateAllProduct,
  deleteProduct,
  searchProduct,
  demSoLuongSP,
  getSingleProductController,
  getLatestProducts,
};
