const jwt = require("jsonwebtoken");
const { TOKEN_NAME } = require("../utils/constants");

module.exports = function async(req, res, next) {
  const token = req.header(TOKEN_NAME);
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
