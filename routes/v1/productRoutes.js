const express = require('express')



const userAuth = require('../../middleWares/userAuth')
const { addProduct,getProductById, getCategoryProducts, productsByQueries, productByCategory, updateProduct, getSellerProducts, verifyProduct, toggleProductVerification, deleteproduct, topSellingProducts, deleteAllOrders, latestCollections } = require('../../controllers/USER/productControllers')
const { upload } = require('../../middleWares/multer')
const sellerAuth = require('../../middleWares/sellerAuth')
const Admin = require('../../model/adminModel')
const adminAuth = require('../../middleWares/adminAuth')
const adminOrSellerAuth = require('../../middleWares/adminOrSellerAuth')





const router = express.Router()

router.post('/add-product',upload.array('images'),sellerAuth,addProduct)
router.get('/product-details/:productId',getProductById)
router.get('/category-products',getCategoryProducts)
router.get('/search',productsByQueries)
router.get('/seller-products/:sellerId',adminOrSellerAuth,getSellerProducts)
router.get('/filter/:category',productByCategory)
router.post('/update-product/:productId',upload.array('images'),sellerAuth,updateProduct)
router.post('/verify-product/:productId',adminAuth,verifyProduct)
router.post('/product-deactivate/:productId',adminAuth,toggleProductVerification)
router.delete('/delete-product/:productId',adminOrSellerAuth,deleteproduct)
router.get('/top-products',topSellingProducts)
router.get('/latest-collection',latestCollections)

module.exports = router