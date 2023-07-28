const { Router } = require("express");
const {  sendEmail,  } = require("../controllers/emailControllers")
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = Router();

router.post("/", authMiddleware,sendEmail );

module.exports = router;
