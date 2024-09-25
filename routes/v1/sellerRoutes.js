const express = require('express')  
const { sellerSignup, SellerLogin, sellerLogout, sellerProfile, verifySeller, checkAdmin, checkSeller } = require('../../controllers/SELLER/sellerAuthControllers')
const sellerAuth = require('../../middleWares/sellerAuth')
const { upload } = require('../../middleWares/multer')
const adminAuth = require('../../middleWares/adminAuth')
const {getSellerNotifications, deleteSellerNotification, getNotificationById, updateNotification} = require('../../controllers/SELLER/sellerNotifications')
const { stepOneValidation, stepTwoValidation } = require('../../controllers/SELLER/verificationStepController')
const Order = require('../../model/orderModel')
const anyAuth = require('../../middleWares/anyAuth')



const router = express.Router()
 
router.post('/signin', upload.single('registrationCertificate'),sellerSignup)
router.post('/verify-seller',adminAuth,verifySeller)
router.post('/login',SellerLogin)
router.post('/logout',sellerLogout)
router.get('/profile/:sellerId',anyAuth,sellerProfile)
router.post('/check-seller',sellerAuth,checkSeller)
router.get('/notifications',sellerAuth,getSellerNotifications)
router.delete('/delete-notification/:notificationId',sellerAuth,deleteSellerNotification)
router.get('/notification-details/:notificationId',getNotificationById)
router.post('/update-notification/:notificationId',sellerAuth,updateNotification)
router.post('/verification-one',stepOneValidation)
router.post('/verification-two',stepTwoValidation)




module.exports = router