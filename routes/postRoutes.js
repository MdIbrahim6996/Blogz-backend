const { Router } = require("express");
const {
  post,
  createPost,
  fetchPosts,
  fetchPost,
  updatePost,
  deletePost,
  toggleLikePost,
  toggleDislikePost,
} = require("../controllers/postControllers");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = Router();

//!router.get('/post', post);
// router.post(
//   "/",
//   authMiddleware,
//   profilePhotoUpload.single("image"),
//   postPhotoResize,
//   createPost
// );
router.post("/create", authMiddleware,createPost);
router.get("/", fetchPosts);
router.get("/:id", fetchPost);
router.put("/likes", authMiddleware, toggleLikePost);
router.put("/dislikes", authMiddleware, toggleDislikePost);
router.delete("/:id", authMiddleware, deletePost);
router.put("/:id", authMiddleware, updatePost);

module.exports = router;
