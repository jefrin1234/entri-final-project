const { cloudinaryInstance } = require("../config/cloudinaryConfig");

const handleImageUpload = async(path)=>{
    try {
         console.log("hitted+___")
         console.log("prhfdb++",path)
        const uploadResult = await cloudinaryInstance.uploader.upload(path);
        console.log("_____+++",uploadResult)
        return uploadResult.url;
        

    } catch (error) {
        next(error)
        
    }
}

module.exports={handleImageUpload}