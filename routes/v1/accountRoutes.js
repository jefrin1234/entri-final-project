const express = require('express')
const { addBankAccount } = require('../../controllers/SELLER/bankAccountControllers')
const sellerAuth = require('../../middleWares/sellerAuth')

const router = express.Router()


router.post('/add-account',sellerAuth,addBankAccount)


module.exports = router