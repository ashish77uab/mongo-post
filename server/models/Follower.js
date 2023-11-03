import mongoose from "mongoose";

const followerSchema = mongoose.Schema(
  {
    followingUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { strictQuery: false }
);

export default mongoose.model("Follower", followerSchema);
