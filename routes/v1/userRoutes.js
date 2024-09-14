const express = require('express')  
const router = express.Router() 

const { signup, login, userLogout, userProfile, checkUser, updateUserRole } = require('../../controllers/USER/userAuthControllers')
const userAuth = require('../../middleWares/userAuth')
const adminAuth = require('../../middleWares/adminAuth')
const {upload} = require('../../middleWares/multer')



router.post('/signup',upload.single('images'),signup) 

router.post('/login',login)

router.post('/logout',userLogout)

router.get('/profile',userAuth,userProfile)

router.get("/check-user", userAuth, checkUser);

router.post('/update-user-role',adminAuth,updateUserRole)

module.exports = router