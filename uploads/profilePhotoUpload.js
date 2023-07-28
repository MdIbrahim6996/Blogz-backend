const multer  = require('multer')
const sharp = require("sharp");
const path = require("path");


const multerStorage = multer.memoryStorage();

//!file type check
const multerFilter = (req, file, cb) => {
    console.log("inside")
    if(file.mimetype.startsWith("image")){
        cb(null, true)
    }else{
        //rejected files
        cb({
            message: "Unsupported file format",
        }, false)
    }
}

exports.profilePhotoUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limit:{fileSize:1000000}
});

exports.profilePhotoResize = async (req, res, next) => {
    if(!req.file)return next();

    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
await sharp(req.file.buffer).resize(250, 250).toFormat("jpeg").jpeg({quality:90}).toFile(path.join(`public/images/profile/${req.file.filename}`));
next();
}

exports.postPhotoResize = async (req, res, next) => {
    if(!req.file)return next();

    req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
await sharp(req.file.buffer).resize(500, 500).toFormat("jpeg").jpeg({quality:90}).toFile(path.join(`public/images/posts/${req.file.filename}`));
next();
}


