const express = require('express')
const { getAllFavourites, addToFavourites, removeFromFavourites } = require('../../controllers/USER/favouriteControllers')
const userAuth = require('../../middleWares/userAuth')

const router = express.Router()

router.get('/all-favourites',userAuth,getAllFavourites)
router.post('/add-favourite',userAuth,addToFavourites)
router.delete('/delete-favourite',userAuth,removeFromFavourites)


module.exports = router