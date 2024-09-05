const express = require('express')  
const router = express.Router() 

const { upload } = require('../../middleWares/multer')
const { signup, login, userLogout, userProfile } = require('../../controllers/USER/userAuthControllers')



router.post('/signup',upload.single('images'),signup) 

router.post('/login',login)

router.post('/logout',userLogout)

router.get('/profile',userProfile)

module.exports = router