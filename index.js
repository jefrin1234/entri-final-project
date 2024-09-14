require('dotenv').config()   // requiring dotenv for private codes
const express = require('express') //importing express for server 
const cookieParser = require('cookie-parser')//cookie parser for parsing cookies
const ConnectDB = require('./config/db')//importing file for connecting with database
const app = express()//creating instance for express
const cors = require('cors')  //importing cors for accepting request from cross origins
const apiRouter = require('./routes')//importing apiRouter
const { handleError } = require('./utils/error')


ConnectDB()//calling ConnectDB function for connecting to database


app.use(cookieParser())//using cookieParser

//accepting cross origin requests
app.use(cors({
  credentials : true,//accepting cookies form cross origin requests
  origin : true

}))

app.use(express.json())//for getting body from the request 

//sample code for request hitted the backend
app.get("/", (req, res) => {
  res.send("Hello  World!");
});


app.use('/api',apiRouter)//when a requset is come to '/api'  go to 'apiRouter'

app.use(handleError);//when any of the requst  results in error the error is passed to this function and   this function runs


app.listen(3000,()=>console.log("server running on port 3000"))//connecting to the port 3000 for the server





