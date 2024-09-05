const express = require('express')
const userAuth = require('../../middleWares/userAuth')
const { addAddress,addressById, getAddress, updateAddress, deleteAddress } = require('../../controllers/USER/addressControllers')


const router = express.Router()

router.post('/add-address',userAuth,addAddress)
router.get('/addressById',userAuth,addressById)
router.get('/user-address',userAuth,getAddress)
router.patch('/update-address',userAuth,updateAddress)
router.delete('/delete-address',userAuth,deleteAddress)

module.exports = router