const express = require('express')
const userAuth = require('../../middleWares/userAuth')
const { addToCart, updateCart, deleteCart, getCart, cartCounts } = require('../../controllers/USER/cartControllers')

const router = express.Router()

router.post('/addtocart',userAuth,addToCart)
router.patch('/update-cart',userAuth,updateCart)
router.delete('/delete-cart/:productId',userAuth,deleteCart)
router.get('/cart-details',userAuth,getCart)
router.get('/cart-counts',userAuth,cartCounts)

module.exports = router