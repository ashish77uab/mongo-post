import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    title: String,
    message: String,
    fullName: String,
    creator: String,
    tags: { type: [String], default: [] },
    selectedFile: String,
    likes: {
      type: [String],
      default: [],
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
postSchema.virtual("parentComment", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});
postSchema.virtual("favourites", {
    ref: "FavouritePost",
    localField: "_id",
    foreignField: "post",
  });
export default mongoose.model("Post", postSchema);
