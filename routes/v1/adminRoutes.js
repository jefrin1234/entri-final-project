const express = require('express')  
const router = express.Router() 

const getAdminNotification = require('../../controllers/ADMIN/adminNotificationController')
const adminAuth = require('../../middleWares/adminAuth')
const { login, logOut, adminProfile, signup } = require('../../controllers/ADMIN/adminAuthControllers')


router.post('/signup',signup)
router.post('/login',login)

router.post('/logout',logOut)

router.get('/profile',adminAuth,adminProfile)

router.get('/notification',adminAuth,getAdminNotification)





module.exports = router