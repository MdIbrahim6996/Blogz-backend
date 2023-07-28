const { Router } = require("express");
const { createComment, fetchAllComments, fetchComment, updateComment, deleteComment, fetchCommentforPost } = require("../controllers/commentControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");


const router = Router();


router.post("/", authMiddleware, createComment);
router.get("/", fetchAllComments);
router.get("/:id", authMiddleware, fetchComment);
router.get("/post/:postId", fetchCommentforPost);
router.put("/:id", authMiddleware, updateComment);
router.delete("/:id", authMiddleware, deleteComment);


module.exports = router;