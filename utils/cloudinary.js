const cloudinary = require('cloudinary');


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const cloudinaryUploadImg = async (file) => {
try {
    const uploadedResponse = await cloudinary.v2.uploader.upload(file, { resource_type: "auto"});
    return {
        url: uploadedResponse?.secure_url,
        publicId: uploadedResponse?.public_id
    }     

} catch (error) {
    console.log(error);
}
  }

module.exports = {cloudinary, cloudinaryUploadImg};