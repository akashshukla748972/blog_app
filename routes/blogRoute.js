const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  handleCreateBlog,
  handleGetSingleBlog,
  handleCommentFromBlog,
} = require("../controllers/blogController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addNewBlog", {
    user: req.user,
  });
});
router.post("/add-new", upload.single("cover_image_url"), handleCreateBlog);
router.get("/:id", handleGetSingleBlog);
router.post("/comment/:id", handleCommentFromBlog);

module.exports = router;
