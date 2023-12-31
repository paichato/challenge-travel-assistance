const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Joi = require("@hapi/joi");
const { TOKEN_NAME } = require("../utils/constants");

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string().min(6).email(),
  password: Joi.string().min(6).required(),
});

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password)
    return res.status(401).send("Missing username or password");

  const userExist = await User.findOne({ username });
  if (userExist) {
    res.status(400).send("User already exists");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    } else {
      const savedUser = await newUser.save();
      const token = jwt.sign({ _id: savedUser._id }, process.env.TOKEN_SECRET, {
        subject: username,
        expiresIn: "1d",
      });
      res
        .status(200)
        .header(TOKEN_NAME, token)
        .json({ user: savedUser, token });
    }
  } catch (err) {
    const errorLog = {
      error: err ?? "unkown details",
      message: "Error creating user",
    };
    res.status(400).send(errorLog);
  }
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).required(),
  password: Joi.string().min(6).required(),
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(401).send("Missing username or password");

  const user = await User.findOne({ username });
  if (!user) return res.status(400).send("Username or Password is incorrect");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).send("Username or password is incorrect");

  try {
    const { error } = await loginSchema.validateAsync(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    else {
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
        subject: username,
        expiresIn: "1d",
      });
      const deepUser = JSON.parse(JSON.stringify(user));
      delete deepUser["password"];
      res.header(TOKEN_NAME, token).json({ user: deepUser, token });
    }
  } catch (err) {
    const errorLog = {
      error: err ?? "unkown details",
      message: "Error with user session",
    };
    res.status(500).send(errorLog);
  }
});

module.exports = router;
