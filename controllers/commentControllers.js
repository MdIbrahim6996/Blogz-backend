const Comment = require("../models/commentModel");
const { validateMobgodbID } = require('../utils/validateMongodbID');

//-------------------------------------------------------------
//Create
//-------------------------------------------------------------
exports.createComment = async (req, res, next) => {
  //1.Get the user
  const user = req.user;
  //2.Get the post Id
  const { postId, description } = req.body;
  console.log(description);
  try {
    const comment = await Comment.create({
      post: postId,
      user,
      description,
    });
    res.json(comment);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//-------------------------------
//fetch all comments
//-------------------------------

exports.fetchAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({}).sort("-createdAt");
    res.json(comments);
  } catch (error) {
    console.log(error);
    next(error);  }
};

//------------------------------
//commet details
//------------------------------
exports.fetchComment = async (req, res, next) => {
  const { id } = req.params;
  validateMobgodbID(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    console.log(error);
    next(error);  }
};

//------------------------------
//commet for a post
//------------------------------
exports.fetchCommentforPost = async (req, res, next) => {
  const { postId } = req.params;
  validateMobgodbID(postId);
  try {
    const comment = await Comment.find({post:postId});
    res.json(comment);
  } catch (error) {
    console.log(error);
    next(error);  }
};


//------------------------------
//Update
//------------------------------

exports.updateComment = async (req, res, next) => {
  const { id } = req.params;
  validateMobgodbID(id);
  try {
    const update = await Comment.findByIdAndUpdate(
      id,
      {
        // post: req.body?.postId,
        // user: req?.user,
        description: req?.body?.description,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(update);
  } catch (error) {
    console.log(error);
    next(error);  }
};

//------------------------------
//delete
//------------------------------

exports.deleteComment = async (req, res, next) => {
  const { id } = req.params;
  validateMobgodbID(id);
  try {
    const comment = await Comment.findByIdAndDelete(id);
    res.json(comment);
  } catch (error) {
    console.log(error);
    next(error);  }
};


