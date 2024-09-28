const express = require('express')  
const router = express.Router() 

const adminAuth = require('../../middleWares/adminAuth')
const { login, logOut, adminProfile, signup, checkAdmin } = require('../../controllers/ADMIN/adminAuthControllers')
const { getAdminNotification, updateNotification, deleteNotification } = require('../../controllers/ADMIN/adminNotificationController')
const { getAllUsers, deleteUser, updateUserRole } = require('../../controllers/USER/userAuthControllers')
const { getAllSellers, deleteSeller, unverifySeller } = require('../../controllers/ADMIN/SellerControllers')


router.post('/signup',signup)

router.post('/login',login)

router.post('/logout',logOut)

router.get('/profile',adminAuth,adminProfile)

router.get('/admin-notifications',adminAuth,getAdminNotification)

router.post('/check-admin',adminAuth,checkAdmin)

router.post('/update-notification/:notificationId',updateNotification)

router.delete('/notification/:id',deleteNotification)

router.get('/all-users',adminAuth,getAllUsers)

router.delete('/delete-user/:userId',adminAuth,deleteUser)

router.patch('/role-update/:userId',adminAuth,updateUserRole)

router.get('/all-sellers',adminAuth,getAllSellers)

router.delete('/delete-seller/:sellerId',adminAuth,deleteSeller)

router.patch('/unverify-seller/:sellerId',adminAuth,unverifySeller)

module.exports = router