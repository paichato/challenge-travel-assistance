const User = require("../models/User");
const verify = require("../middlewares/authVerify");
const router = require("express").Router();

/**
 * endpoint to validate if token is valid and if token correponds to user
 */
router.get("/validate-user", verify, async (req, res) => {
  try {
    const { sub } = req.user;
    const results = await User.findOne({ username: sub }).exec();
    res.json(results);
  } catch (error) {
    res.status(404).send("User not found or token is invalid");
  }
});

module.exports = router;
