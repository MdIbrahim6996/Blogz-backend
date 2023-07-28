const NodeCache = require("node-cache");
const User = require("../models/userModel");

const cache = new NodeCache({ stdTTL: 20 });

exports.verifyCache = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (cache.has(id)) {
      return res.status(200).json(cache.get(id));
    } else {
      const myProfile = await User.findById(id).populate("post");
      cache.set(id, myProfile, 300);
    }
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
