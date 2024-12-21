const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");

const handleCreateBlog = async (req, res) => {
  try {
    const { title, body } = req?.body;
    const { filename } = req?.file;
    console.log("1");
    if (!title || !body) {
      const missingFields = [];
      if (!title) missingFields.push("Email");
      if (!body) missingFields.push("Body");
      return res.render("addNewBlog", {
        error: `${missingFields.join(" and ")}is require`,
      });
    }

    console.log("2");

    const newBlog = await Blog.create({
      title,
      body,
      cover_image_url: `/uploads/${filename}`,
      created_by: req.user._id,
    });
    console.log("new Blog", newBlog);
    return res.redirect("/");
  } catch (error) {
    console.error("Error", error);
    res.redirect("/blogs/add-blog");
  }
};

const handleGetSingleBlog = async (req, res) => {
  try {
    const id = req.params.id;
    const singleBlog = await Blog.findById(id).populate("created_by");
    const comment = await Comment.find({ blog_id: id })
      .sort({ createdAt: -1 })
      .populate("created_by");

    res.render("showBlog", {
      user: req.user,
      blogs: singleBlog,
      comment: comment,
    });
  } catch (error) {
    console.error("Error", error);
  }
};

const handleCommentFromBlog = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.render({ error: "Content is required" });
    }

    console.log("Comment", content);
    const newComment = await Comment.create({
      content: content,
      blog_id: req?.params.id,
      created_by: req?.user?._id,
    });
    console.log("Comment", newComment);

    return res.redirect(`/blogs/${req.params.id}`);
  } catch (error) {
    console.error("Error", error);
    return res.redirect(`/blogs/${req.params.id}`);
  }
};

module.exports = {
  handleCreateBlog,
  handleGetSingleBlog,
  handleCommentFromBlog,
};
