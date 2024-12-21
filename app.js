const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const userRoute = require("./routes/userRoute");
const blogRoute = require("./routes/blogRoute");
const connectToDb = require("./configs/db");
const {
  userAuthentication,
  checkAuthenticationCookie,
} = require("./middlewares/authMiddleware");
const cookieParser = require("cookie-parser");
const Blog = require("./models/blogModel");

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
app.use(checkAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

// routes
app.use("/users/", userRoute);
app.use("/blogs/", blogRoute);
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  return res.render("home", { user: req.user, blogs: allBlogs });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Server started at PORT : ${PORT}`);
});
