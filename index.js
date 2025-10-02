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

///server codes
/*
✅ 2xx – Success

These mean everything went as expected.

200 OK → Standard success. Use it for GET, PUT, PATCH when the response body has data.

201 Created → A new resource was created (e.g. signup, new post).

202 Accepted → Request accepted but not processed yet (async jobs, background processing).

204 No Content → Success but no body to return (e.g. delete operation).

❌ 4xx – Client Errors

The client did something wrong.

400 Bad Request → Request body/params are invalid (validation error).

401 Unauthorized → Authentication required or token missing/invalid.

403 Forbidden → Authenticated but not allowed (e.g. normal user trying to access admin API).

404 Not Found → Resource doesn’t exist (wrong ID, missing route).

405 Method Not Allowed → Wrong HTTP method (e.g. POST used on a GET-only route).

409 Conflict → Request conflicts with server state (e.g. email already registered).

422 Unprocessable Entity → Request format correct, but validation failed (often used instead of 400).

429 Too Many Requests → Rate limit exceeded.

💥 5xx – Server Errors

Your backend messed up.

500 Internal Server Error → Generic server crash/error.

502 Bad Gateway → Server got an invalid response from an upstream service.

503 Service Unavailable → Server down/overloaded (useful for maintenance).

504 Gateway Timeout → Timeout from an upstream service.

🌟 Practical API Usage Example:

Signup success → 201 Created

Login failed (wrong password) → 401 Unauthorized

User tries to access another user’s resource → 403 Forbidden

Resource not found → 404 Not Found

Validation error (bad email format) → 400 Bad Request

Server crashed during DB call → 500 Internal Server Error

👉 As a rule of thumb:

Use 2xx when everything is fine.

Use 4xx when the client needs to fix something.

Use 5xx when it’s your backend’s fault.
*/
