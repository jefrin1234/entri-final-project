const express = require('express')
const router = express.Router()
const {allOrders,updateProductStatus,sellerOrders, userOrders} = require('../../controllers/USER/orderControllers')
const userAuth = require('../../middleWares/userAuth')
const sellerAuth = require('../../middleWares/sellerAuth')
const adminAuth = require('../../middleWares/adminAuth')
const adminOrSellerAuth = require('../../middleWares/adminOrSellerAuth')

router.get('/all-orders',adminAuth,allOrders)
router.get('/seller-orders/:sellerId',adminOrSellerAuth,sellerOrders)
router.post('/update-order',sellerAuth,updateProductStatus)
router.get('/user-orders',userAuth,userOrders)

module.exports = router