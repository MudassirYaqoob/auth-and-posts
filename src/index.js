const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// middlewares (your own code)
const {
  notFound,
  logger,
  errorHandler,
} = require("./middlewares/helperMiddlewares");

// routers (your own code)
const authRouter = require("./routers/authRouter");
const postsRouter = require("./routers/postsRouter");

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);

app.use(notFound);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database is connected!");
    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening server on port " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.error("Got error: " + error);
  });

app.use(errorHandler);
