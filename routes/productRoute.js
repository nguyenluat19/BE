const express = require('express');
const { createProduct,
    getAllProducts,
    getProductById,
    updateAllProduct,
    deleteProduct,
    searchProduct,
    demSoLuongSP,
    getListProducts,
    getSingleProductController,
    getLatestProducts }
    = require('../controllers/productController');
const router = express.Router();

router.post('/product', createProduct)
router.get('/products', getAllProducts)
router.get('/products/SpMoi', getLatestProducts)
router.get('/products/:id', getProductById)
router.get('/get-product/:slug', getSingleProductController)
router.put('/update/products/:id', updateAllProduct)
router.delete('/delete/products/:id', deleteProduct)
router.get('/search/', searchProduct)
router.get('/demSoLuongSP', demSoLuongSP)
router.get('/products/:page', getListProducts)

module.exports = router;