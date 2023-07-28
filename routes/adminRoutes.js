const { Router } = require("express");

const {
  fetchUsers,
  deleteUser,
  userDetails,
  userProfile,
  updateUserProfile,
  updateUserPassword,
  followingUser,
  generateVerificationToken,
  accountVerification,
  blockUser,
  unBlockUser,
  forgetPasswordToken,
  passwordReset,
  unFollowingUser,
  profilePhotoUploadCtrl,
} = require("../controllers/userControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");
const {
  profilePhotoUpload,
  profilePhotoResize,
} = require("../uploads/profilePhotoUpload");
const { verifyCache } = require("../middlewares/verifyCache");
const router = Router();

//!FETCH ALL USER
router.get("/", fetchUsers);



//!USER DETAILS AND PROFILE
router.get("/:id", userDetails);
// verifyCache
// router.get("/profile/:id", authMiddleware, userProfile);



//!UPDATE DETAILS
router.put("/update", authMiddleware, updateUserProfile);
router.put("/update/password/:id", authMiddleware, updateUserPassword);

//!BLOCK AND UNBLOCK USER
router.put("/block-user/:id", authMiddleware, blockUser);
router.put("/unblock-user/:id", authMiddleware, unBlockUser);



//!DELETE A USER
router.delete("/:id", deleteUser);

//!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
//!FOLLOW AND UNFOLLOW A USER
// router.put("/follow", authMiddleware, followingUser);
// router.put("/unfollow", authMiddleware, unFollowingUser);

//!PROFILE PHOTO UPLOAD
// router.post(
//   "/profile-photo",
//   authMiddleware,
//   profilePhotoUploadCtrl
// );

//!ACCOUNT VERIFICATION
// router.post(
//   "/generate-verify-token",
//   authMiddleware,
//   generateVerificationToken
// );
// router.post("/verify-account", accountVerification);

//!PASSWORD RESET
// router.post("/forget-password-token", forgetPasswordToken);
// router.put("/reset-password", passwordReset);
module.exports = router;
