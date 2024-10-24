const cloudinary = require('cloudinary').v2;


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

const cloudinaryUploadImg = async (file, title) => {
try {
    const uploadedResponse = await cloudinary.uploader.upload(file, 
           {
          public_id: title.trim(),
        });
    return {
        url: uploadedResponse?.secure_url,
        publicId: uploadedResponse?.public_id
    }     

} catch (error) {
    console.log(error);
}
  }

module.exports = {cloudinary, cloudinaryUploadImg};