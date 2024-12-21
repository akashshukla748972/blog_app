const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    blog_id: {
      type: Schema.Types.ObjectId,
      ref: "blog",
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

const Comment = model("comment", commentSchema);
module.exports = Comment;
