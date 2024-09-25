const express = require('express')



const userAuth = require('../../middleWares/userAuth')
const { addProduct,getProductById, getCategoryProducts, productsByQueries, productByCategory, updateProduct, getSellerProducts, verifyProduct } = require('../../controllers/USER/productControllers')
const { upload } = require('../../middleWares/multer')
const sellerAuth = require('../../middleWares/sellerAuth')
const Admin = require('../../model/adminModel')
const adminAuth = require('../../middleWares/adminAuth')



const router = express.Router()

router.post('/add-product',upload.array('images'),sellerAuth,addProduct)
 router.get('/product-details/:productId',getProductById)
router.get('/category-products',getCategoryProducts)
router.get('/search',productsByQueries)
router.get('/seller-products/:sellerId',getSellerProducts)
router.get('/filter/:category',productByCategory)
router.post('/update-product/:productId',upload.array('images'),sellerAuth,updateProduct)
router.post('/verify-product/:productId',adminAuth,verifyProduct)

module.exports = router