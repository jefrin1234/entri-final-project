const express = require('express')
const router = express.Router()
const {allOrders,updateProductStatus,sellerOrders, userOrders} = require('../../controllers/USER/orderControllers')
const userAuth = require('../../middleWares/userAuth')
const sellerAuth = require('../../middleWares/sellerAuth')
const adminAuth = require('../../middleWares/adminAuth')

router.get('/add-orders',adminAuth,allOrders)
router.get('/seller-orders',sellerAuth,sellerOrders)
router.patch('/update-order',sellerAuth,updateProductStatus)
router.get('/user-orders',userAuth,userOrders)

module.exports = router