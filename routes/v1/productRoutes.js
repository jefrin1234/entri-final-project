const express = require('express')



const userAuth = require('../../middleWares/userAuth')
const { addProduct,getProductById, getAllProducts, productsByQueries, productByCategory, updateProduct } = require('../../controllers/USER/productControllers')
const { upload } = require('../../middleWares/multer')
const sellerAuth = require('../../middleWares/sellerAuth')



const router = express.Router()

router.post('/add-product',upload.array('images'),sellerAuth,addProduct)
 router.get('/product',getProductById)
router.get('/all-products',getAllProducts)
router.get('/query',productsByQueries)
router.get('/category',userAuth,productByCategory)
router.post('/update-product/:productId',upload.array('images'),sellerAuth,updateProduct)
module.exports = router