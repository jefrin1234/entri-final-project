require('dotenv').config()  
const express = require('express') 
const cookieParser = require('cookie-parser')
const ConnectDB = require('./config/db')
const app = express()
const cors = require('cors')  
const apiRouter = require('./routes')
const { handleError } = require('./utils/error')


ConnectDB()

app.use(cookieParser())



app.use(cors({
  origin: true, 
  credentials: true,               
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS' ,'PATCH'],
}));



app.use(express.json())


app.get("/", (req, res) => {
  res.send("Hello  World!");
});


app.use('/api',apiRouter)

app.use(handleError);                   
                                     

app.listen(3000,()=>console.log("server running on port 3000"))




