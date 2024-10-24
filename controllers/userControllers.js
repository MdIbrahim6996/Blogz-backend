const crypto = require("crypto");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const User = require("../models/userModel");
const { cloudinaryUploadImg } = require("../utils/cloudinary");
const { sendEmail } = require("../utils/email");
const { validateMobgodbID } = require("../utils/validateMongodbID");

const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.fetchUsers = async (req, res, next) => {
  const { page } = req.query;
  const limit = 10;
  try {
    const users = await User.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .sort("-createdAt");
    res.json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateMobgodbID(id);
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.userDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateMobgodbID(id);
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.userProfile = async (req, res, next) => {
  const { id } = req.params;
  validateMobgodbID(id);

  try {
    const myProfile = await User.findById(id).populate("post");
    res.json(myProfile);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateUserProfile = async (req, res, next) => {
  const { id } = req?.user;
  validateMobgodbID(id);
  const { firstName, lastName, email } = req.body;

  const user = await User.findById(id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName: firstName ? firstName : user?.firstName,
        lastName: lastName ? lastName : user?.lastName,
        email: email ? email : user?.email,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.updateUserPassword = async (req, res, next) => {
  const { id } = req?.user;
  const { password } = req?.body;

  validateMobgodbID(id);

  try {
    const user = await User.findById(id);

    if (password) {
      user.password = password;
      const updatedUser2 = await user.save();
      return res.json(updatedUser2);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!          FOLLOW AND UNFOLLOW USER
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.followingUser = async (req, res, next) => {
  //!1. find the user to follow and update its followers feild
  const { followId } = req.body;
  const loginUserId = req.user.id;
  try {
    validateMobgodbID(followId);

    const targetUser = await User.findById(followId);

    const alreadyFollowing = targetUser?.followers?.find(
      (userId) => userId.toString() === loginUserId
    );

    if (alreadyFollowing)
      throw new Error("You have already followed this user");

    const updatedUser = await User.findByIdAndUpdate(
      followId,
      {
        $push: { followers: loginUserId },
        isFollowing: true,
      },
      { new: true }
    );

    //!2. update the login user following field
    await User.findByIdAndUpdate(
      loginUserId,
      {
        $push: { following: followId },
      },
      { new: true }
    );
    res.send("You have successfully followed this user");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.unFollowingUser = async (req, res, next) => {
  //!1. find the user to follow and update its followers feild
  try {
    const { unFollowId } = req.body;
    const loginUserId = req.user.id;
    validateMobgodbID(unFollowId);

    await User.findByIdAndUpdate(
      unFollowId,
      {
        $pull: { followers: loginUserId },
        isFollowing: false,
      },
      { new: true }
    );

    //!2. update the login user following field
    await User.findByIdAndUpdate(loginUserId, {
      $pull: { following: unFollowId },
    });
    res.send("You have successfully unfollowed this user");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!          BLOCK AND UNBLOCK USER
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.blockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateMobgodbID(id);
    const user = await User.findOneAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.unBlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateMobgodbID(id);
    const user = await User.findOneAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.generateVerificationToken = async (req, res, next) => {
  try {
    const loginUserId = req.user.id;
    const { email } = req?.user;
    const user = await User.findById(loginUserId);
    //!Generate Token
    const verificationToken = await user.createAccountVerificationToken();
    await user.save();

    //!reset url
    const resetUrl = `if you requested to verify account, verify within 10 minutes. otherwise ignore
    <a href='http://localhost:3000/verify-account/${verificationToken}'>Click to verify</a>`;
    sendEmail(email, resetUrl);
    res.send(resetUrl);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.accountVerification = async (req, res, next) => {
  const token= "token"
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
  });
  res.json(userFound);
  // console.log(hashedToken);
  // res.send(hashedToken);
  try {
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!          FORGET PASSWORD TOKEN GENERATOR
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.forgetPasswordToken = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not Found!!!");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetUrl = `if you requested to reset password of your account, reset within 10 minutes. otherwise ignore
    <a href='http://localhost:3000/reset-password/${token}'>Click to verify</a>`;

    // sendEmail(email, resetUrl);
    res.send(resetUrl);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!                  PASSWORD RESET
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.passwordReset = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const userFound = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!userFound) throw new Error("Token expired!");
    await userFound.save();

    //!update password

    userFound.password = password;
    userFound.passwordResetToken = undefined;
    userFound.passwordResetExpires = undefined;
    await userFound.save();

    res.json(userFound);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//!        PROFILE PHOTO UPLOAD
//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

exports.coverPhotoUploadCtrl = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { userImg, name } = req.body;

    const imageResponse = await cloudinary.uploader.upload(userImg, {
      public_id: name,
      width: 200,
      height: 200,
    });
    const user = await User.findByIdAndUpdate(
      id,
      {
        profilePhoto: imageResponse?.secure_url,
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.profilePhotoUploadCtrl = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { userImg, name } = req.body;

    const imageResponse = await cloudinary.uploader.upload(userImg, {
      public_id: name,
      width: 200,
      height: 200,
    });
    const user = await User.findByIdAndUpdate(
      id,
      {
        profilePhoto: imageResponse?.secure_url,
      },
      { new: true }
    );

    res.json(user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
