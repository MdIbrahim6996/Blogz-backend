const { Router } = require("express");
const {
  register,
  login,
  logout,
  generateVerificationToken,
  accountVerification,
  generateResetPasswordToken,
  resetPassword,
} = require("../controllers/authControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.post("/generate-reset-password-token", generateResetPasswordToken);
router.put("/reset-password", resetPassword);

router.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationToken
);
router.put("/verify-account", accountVerification);

module.exports = router;
