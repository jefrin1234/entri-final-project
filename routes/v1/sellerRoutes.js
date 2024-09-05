const express = require('express')  
const { sellerSignup, SellerLogin, sellerLogout, sellerProfile } = require('../../controllers/SELLER/sellerAuthControllers')



const router = express.Router()
 
router.post('/signin',sellerSignup)
router.post('/login',SellerLogin)
router.post('/logout',sellerLogout)
router.get('/profile',sellerProfile)



module.exports = router