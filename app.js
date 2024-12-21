const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const userRoute = require("./routes/userRoute");
const connectToDb = require("./configs/db");
const { userAuthentication } = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();
connectToDb(process.env.MONGO_URL)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Error", error));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use("/users/", userRoute);
app.get("/", userAuthentication, (req, res) => {
  return res.render("home", { user: req.user });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Server started at PORT : ${PORT}`);
});
