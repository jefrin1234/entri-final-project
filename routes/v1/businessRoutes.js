const express = require('express')
const {addbusinessDetails} = require('../../controllers/SELLER/bussinessDetailsControllers')
const { upload } = require('../../middleWares/multer')
const sellerAuth = require('../../middleWares/sellerAuth')
const router = express.Router()

router.post('/add-business',upload.array('images'),sellerAuth,addbusinessDetails)


module.exports = router