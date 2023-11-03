import mongoose from "mongoose";

const favouritePostSchema = mongoose.Schema(
  {
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { strictQuery: false }
);

export default mongoose.model("FavouritePost", favouritePostSchema);
