const { v2 } = require("cloudinary");

v2.config({ 
  cloud_name: 'dxsxlk0kd', 
  api_key: '762816225345222', 
  api_secret: process.env.CLOUD_SECRET_KEY 
})

const cloudinaryInstance = v2;    

module.exports = {cloudinaryInstance}