const { signupSchema, signinSchema } = require("../middlewares/validator.js");
const User = require("../models/usersModel.js");
const {
  doHash,
  doHashValidation,
  hmacProcess,
} = require("../utils/hashing.js");
const jwt = require("jsonwebtoken");
const transport = require("../middlewares/sendEmail.js");

exports.signup = async (req, res, next) => {
  console.log("body received is " + req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      status: false,
      message: "The email and password are required.",
    });
  }
  const { error, value } = signupSchema.validate({ email, password });
  if (error) {
    return res.status(300).json({
      status: false,
      message: "Error: " + error,
    });
  }
  const isExistingUser = await User.findOne({ email });
  if (isExistingUser) {
    return res.status(401).json({
      status: false,
      message: "This email is already registered kindly try a different one.",
    });
  }
  const hashedPassword = await doHash(password, 12);
  const newUser = new User({
    email: email,
    password: hashedPassword,
  });
  const result = await newUser.save();
  result.password = undefined;
  res.json({
    status: true,
    profile: result,
  });
};
exports.signin = async (req, res, next) => {
  console.log("body received is " + req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).json({
      status: false,
      message: "The email and password are required.",
    });
  }
  const { error, value } = signinSchema.validate({ email, password });
  if (error) {
    return res.status(300).json({
      status: false,
      message: "Error: " + error,
    });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      status: false,
      message: `The user with email ${email} is not found`,
    });
  }

  const hashValidation = await doHashValidation(password, user.password);
  if (!hashValidation) {
    return res.status(401).json({
      status: false,
      message: "Invalid email or password",
    });
  }
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
      verified: user.verified,
    },
    process.env.TOKEN_SECRET
  );
  res
    .cookie("Authorization", "Bearer " + token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      status: true,
      profile: user,
    });
};

exports.signout = (req, res, next) => {
  res.clearCookie("Authorization").status(302).type("text").send("");
};

exports.sendCode = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(404).json({
      status: false,
      message: "Email is required",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "Email is not yet registered kindly signup first.",
    });
  }
  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  console.log("code is==>" + code);

  let info = await transport.sendMail({
    from: process.env.CODE_SENDER_EMAIL,
    to: user.email,
    subject: "verification code",
    html: "<h1>" + code + "</h1>",
  });
  console.log("infor is==>" + info);
  if (info.accepted[0] === user.email) {
    const hashedCodeValue = hmacProcess(
      code,
      process.env.HMAC_VERIFICATION_SECRET
    );
    user.verificationCode = hashedCodeValue;
    user.verificationCodeValidation = Date.now();
    await user.save();
    return res.status(200).type("text").send("");
  } else {
    return res.status(404).json({
      status: false,
      message: "Something went wrong.. the sender email info is not accepted",
    });
  }
};
