import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  googleId: { type: String, required: false },
  coverImage: { type: String, required: false },
  profileImage: { type: String, required: false },
  description: { type: String, required: false },
  mobile: { type: String, required: false },
  address: { type: String, required: false },
  role: { type: Boolean, default:false },
},{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });
  userSchema.virtual("followers", {
    ref: "Follower",
    localField: "_id",
    foreignField: "userId",
  });
  
 
export default mongoose.model("User", userSchema);
