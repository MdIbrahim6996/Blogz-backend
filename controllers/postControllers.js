const User = require("../models/userModel");
const Post = require("../models/postModel");
const { validateMobgodbID } = require("../utils/validateMongodbID");
const Filter = require("bad-words");
// const fs = require("fs");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: "dlvz7xiqt",
  api_key: "811439918543851",
  api_secret: "eKhvPKBK_OBza-Vbd6qeHFd5UKc",
});

// const { cloudinaryUploadImg } = require("../utils/cloudinary");

exports.createPost = async (req, res, next) => {
  const { id } = req.user;
  const { title, description, category } = req.body;
  console.log(req.body);
  const filter = new Filter();
  const isProfane = filter.isProfane(title, description);

  try {
    validateMobgodbID(id);

    if (isProfane) {
      await User.findByIdAndUpdate(id, {
        isBlocked: true,
      });
      throw new Error(
        "Post Creation failed as it contains abusive words and you have been blocked"
      );
    }

    const imageResponse = await cloudinary.uploader.upload(req.body.image, {
      public_id: title.trim(),
    });

    const post = await Post.create({
      ...req.body,
      image: imageResponse?.secure_url,
      user: id,
    });
    console.log(post);

    res.json(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.fetchPosts = async (req, res, next) => {
  const { page, category } = req.query;
  const limit = 6;
  try {
    const Allposts = await Post.find({});
    const totalResults = Allposts?.length;
    const totalPages = Math.ceil(Allposts?.length / limit);

    if (category === "All") {
      const posts = await Post.find({})
        .populate("user")
        .limit(limit)
        .skip((page - 1) * limit);
      return res.json({ posts, totalResults, totalPages });
    } else {
      const posts = await Post.find({ category })
        .populate("user")
        .limit(limit)
        .skip((page - 1) * limit);
      return res.json({ posts, totalResults, totalPages });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//------------------------------
//Fetch a single post
//------------------------------

exports.fetchPost = async (req, res, next) => {
  const { id } = req.params;
  validateMobgodbID(id);
  try {
    const post = await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      { new: true }
    ).populate("user");
    res.json(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//------------------------------
// Update post
//------------------------------

exports.updatePost = async (req, res) => {
  const { id } = req.params;

  try {
    validateMobgodbID(id);
    const post = await Post.findByIdAndUpdate(
      id,
      {
        ...req.body,
        user: req.user?._id,
      },
      {
        new: true,
      }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
};

//------------------------------
//Delete Post
//------------------------------

exports.deletePost = async (req, res) => {
  const { id } = req.params;
  validateMobgodbID(id);
  try {
    const post = await Post.findByIdAndDelete(id);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
};

//------------------------------
//Likes
//------------------------------

exports.toggleLikePost = async (req, res) => {
  //1.Find the post to be liked
  const { postId } = req.body;
  console.log(postId);
  const post = await Post.findById(postId);
  //2. Find the login user
  const loginUserId = req?.user?._id;
  //3. Find is this user has liked this post?
  const isLiked = post?.isLiked;
  //4.Chech if this user has dislikes this post
  const alreadyDisliked = post?.disLikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  //5.remove the user from dislikes array if exists
  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    return res.json(post);
  }
  //Toggle
  //Remove the user if he has liked the post
  if (isLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    return res.json(post);
  } else {
    //add to likes
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
    return res.json(post);
  }
};

exports.toggleDislikePost = async (req, res) => {
  //1.Find the post to be disLiked
  const { postId } = req.body;
  const post = await Post.findById(postId);
  //2.Find the login user
  const loginUserId = req?.user?._id;
  //3.Check if this user has already disLikes
  const isDisLiked = post?.isDisLiked;
  //4. Check if already like this post
  const alreadyLiked = post?.likes?.find(
    (userId) => userId.toString() === loginUserId?.toString()
  );
  //Remove this user from likes array if it exists
  if (alreadyLiked) {
    const post = await Post.findOneAndUpdate(
      postId,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
    return res.json(post);
  }
  //Toggling
  //Remove this user from dislikes if already disliked
  if (isDisLiked) {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { disLikes: loginUserId },
        isDisLiked: false,
      },
      { new: true }
    );
    return res.json(post);
  } else {
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { disLikes: loginUserId },
        isDisLiked: true,
      },
      { new: true }
    );
    return res.json(post);
  }
};
