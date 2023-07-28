const Category = require("../models/categoryModel");

//create
exports.createCategory = async (req, res, next) => {
  try {
    const category = await Category.create({
      user: req.user._id,
      title: req.body.title,
    });
    res.json(category);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//fetch all
exports.fetchCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({})
      .populate("user")
      .sort("-createdAt");
    res.json(categories);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//fetch a single category
exports.fetchCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id)
      .populate("user")
      .sort("-createdAt");
    res.json(category);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//update
exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(category);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//delete category
exports.deleteCateory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);

    res.json(category);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
