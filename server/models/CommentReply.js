import mongoose from "mongoose";
import { userSchema } from "./User.js";

const commentReplySchema = mongoose.Schema(
  {
    commentId: { type: String },
    userId: { type: String },
    commentText: { type: String },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    isDeleted: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { strictQuery: false }
);

export default mongoose.model("CommentReply", commentReplySchema);
