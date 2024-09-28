const express = require('express')  
const router = express.Router() 

const { signup, login, userLogout, userProfile, checkUser,passwordChange } = require('../../controllers/USER/userAuthControllers')
const userAuth = require('../../middleWares/userAuth')
const adminAuth = require('../../middleWares/adminAuth')
const {upload} = require('../../middleWares/multer')


router.post('/signup',signup) 

router.post('/login',login)

router.post('/logout',userLogout)

router.get('/profile',userAuth,userProfile)

router.post("/check-user", userAuth, checkUser);





router.post('/change-password',adminAuth,passwordChange)



module.exports = router