/* eslint-disable no-undef */

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const {
  notFound,
  logger,
  errorHandler,
} = require("./middlewares/helperMiddlewares.js");
require("dotenv").config();
const authRouter = require("./routers/authRouter.js");
const postsRouter = require("./routers/authRouter.js");
const app = express();
app.use(cors());
app.use(cookieParser());
// @ts-ignore
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use(notFound);
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("Database is connected!");
    app.listen(process.env.PORT, () => {
      console.log("listening server on port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("got error " + error);
  });
app.use(errorHandler);

// these are packages or dependencies that im using here
// // npm i express bcryptjs cookie-parser cors helmet joi
// jsonwebtoken mongoose nodemailer
