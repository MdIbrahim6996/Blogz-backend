require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

//!CODE IMPORTS
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const emailRoutes = require("./routes/emailRoutes");
const commentRoutes = require("./routes/commentRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

//!DATABASE CONNECTION
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected"))
  .catch((err) => console.log(err));

//!EXPRESS APP INITIALIZATION
const app = express();

//!MIDDLEWARES
app.use(cors());
app.use(express.json({limit:"10mb", extended:true}));
app.use(express.urlencoded({ limit:"10mb", extended: true}));
app.use(morgan("dev"));

//!ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/admin", adminRoutes);


//ERROR HANDLER
app.use(notFound);
app.use(errorHandler);

//!SERVER INITIALIZATION
const PORT = 4000;
app.listen(PORT, () => console.log(`Listening : http://localhost:${PORT}`));
