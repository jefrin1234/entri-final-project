const express = require('express')  
const { sellerSignup, SellerLogin, sellerLogout, sellerProfile, verifySeller, checkAdmin, checkSeller } = require('../../controllers/SELLER/sellerAuthControllers')
const sellerAuth = require('../../middleWares/sellerAuth')
const { upload } = require('../../middleWares/multer')
const adminAuth = require('../../middleWares/adminAuth')
const {getSellerNotifications, deleteSellerNotification} = require('../../controllers/SELLER/sellerNotifications')



const router = express.Router()
 
router.post('/signin', upload.single('registrationCertificate'),sellerSignup)
router.post('/verify-seller',adminAuth,verifySeller)
router.post('/login',SellerLogin)
router.post('/logout',sellerLogout)
router.get('/profile',sellerAuth,sellerProfile)
router.post('/check-seller',sellerAuth,checkSeller)
router.get('/notifications',sellerAuth,getSellerNotifications)
router.post('/delete-notification/:notificationId',sellerAuth,deleteSellerNotification)



module.exports = router