import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
  {
    postId: { type: String },
    userId: { type: String },
    commentText: { type: String },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
commentSchema.virtual("commentReply", {
  ref: "CommentReply",
  localField: "_id",
  foreignField: "commentId",
});

export default mongoose.model("Comment", commentSchema);
