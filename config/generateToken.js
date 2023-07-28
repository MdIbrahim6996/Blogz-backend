const jwt = require("jsonwebtoken");

exports.generateToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, {expiresIn:'10d'})
}