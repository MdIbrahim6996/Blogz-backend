const { Router } = require("express");
const { createCategory, fetchCategories, fetchCategory, updateCategory, deleteCateory } = require("../controllers/categoryControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = Router();

router.post("/", authMiddleware, createCategory);
router.get("/", fetchCategories);
router.get("/:id", authMiddleware, fetchCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCateory);
module.exports = router;
