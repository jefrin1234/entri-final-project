const express = require('express')  
const userAuth = require('../../middleWares/userAuth')
const adminAuth = require('../../middleWares/adminAuth')
const { addRating, getProductRatings, getAllRatings, getRatingByUserId, updateRating, deleteRating } = require('../../controllers/USER/ratingControllers')
const adminOrUserAuth = require('../../middleWares/adminOrUserAuth')
const router = express.Router()
 
router.post('/add-rating/',userAuth,addRating)
router.get('/product/:productId',getProductRatings)
router.get('/all-ratings',adminAuth,getAllRatings)
router.get('/user-ratings',userAuth,getRatingByUserId)
router.patch('/update-rating',userAuth,updateRating)
router.delete('/delete-rating',adminOrUserAuth,deleteRating)

module.exports = router