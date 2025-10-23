const cloudinary = require('cloudinary').v2
cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.CLOUD_API_KEY, 
        api_secret: process.env.CLOUD_API_SECRET
})

async function uploadImageToCloudinaryAndReturnUrl(base64) {
  try{
        const url = await cloudinary.uploader.upload(base64)
        const result = await url
        return result.secure_url
    }
    catch(err){
        console.log(err)
        throw new Error("Couldn't upload to cloudinary")
    }
}

module.exports = {uploadImageToCloudinaryAndReturnUrl}