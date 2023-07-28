const mongoose = require("mongoose");

exports.validateMobgodbID = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if(!isValid){
         throw new Error("User not Found");
    }
}