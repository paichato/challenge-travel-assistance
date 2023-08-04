const express = require("express");
const app = express();
const PORT = process.env.PORT || 3337;

app.get("/", (req, res) => {
  res.send(`Hey it's working !!`);
});
app.listen(PORT, () => console.log(`🚀server up and running at  ${PORT}`));

const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoute = require("./routes/auth");
const authDashboard = require("./routes/authDashboard");
const authValidateUser = require("./routes/authValidateUser");

dotenv.config();

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB CONNECTED 😁");
  })
  .catch((error) => console.log("DB CONNECTION ERR:", error));

app.use(express.json(), cors());

app.use("/api/users", authRoute);
app.use("/api/dashboard", authDashboard);
app.use("/api/", authValidateUser);

module.exports = app;
