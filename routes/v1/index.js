const express = require('express')//importing express
const v1Router = express.Router() //creating an instance of express.Router for handling routes

const userRoutes = require('./userRoutes')
const ratingRoutes = require('./ratingRoutes')
const productRoutes = require('./productRoutes')
const sellerRoutes = require('./sellerRoutes')
const cartRoutes = require('./cartRoutes')
const addressRoutes = require('./addressroutes')
const businessRoutes = require('./businessRoutes')
const accountRoutes = require('./accountRoutes')


v1Router.use('/user',userRoutes)  // when a request come to '/user' go to userRoutes
v1Router.use('/rating',ratingRoutes) 
v1Router.use('/products',productRoutes)
v1Router.use('/seller',sellerRoutes)
v1Router.use('/cart',cartRoutes)
v1Router.use('/address',addressRoutes)
v1Router.use('/seller/business',businessRoutes)
v1Router.use('/seller/account',accountRoutes)



module.exports = v1Router
// exporting v1Router