const express = require('express')

const { upload } = require('../../middleWares/multer')

const userAuth = require('../../middleWares/userAuth')
const { addProduct,getProductById, getAllProducts, productsByQueries, productByCategory } = require('../../controllers/USER/productControllers')


const router = express.Router()

router.post('/add-product',upload.array('images'),addProduct)
router.get('/product/:productId',getProductById)
router.get('/all-products',getAllProducts)
router.get('/query',productsByQueries)
router.get('/category',userAuth,productByCategory)

module.exports = router