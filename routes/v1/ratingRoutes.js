const express = require('express')  

const userAuth = require('../../middleWares/userAuth')
const mentorAuth = require('../../middleWares/adminAuth')
const adminAuth = require('../../middleWares/adminAuth')
const { addRating, getProductRatings, getAllRatings, getRatingByUserId, updateRating, deleteRating } = require('../../controllers/USER/ratingControllers')
const router = express.Router()
 
router.post('/add-rating/',userAuth,addRating)
router.get('/:productId',userAuth,getProductRatings)
router.get('/all-ratings',adminAuth,getAllRatings)
router.get('/user-ratings/:userId',userAuth,getRatingByUserId)
router.patch('/update-rating',userAuth,updateRating)
router.delete('/delete-rating/:ratingId',userAuth,deleteRating)

module.exports = router