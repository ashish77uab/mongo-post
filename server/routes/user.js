import express from "express";
const router = express.Router();
import {
  signup,
  signin,
  googleSignIn,
  getUser,
  uploadProfileImage,
  addUserDetails,
  resetPasswordRequestController,
  resetPasswordController,
  getUsers,
  addFollowers,
  removeFollowers
} from "../controllers/user.js";
import { authenticateJWT } from "../middleware/auth.js";

router.post("/register", signup);
router.post("/login", signin);
router.post("/requestResetPassword", resetPasswordRequestController);
router.post("/resetPassword", resetPasswordController);
router.post("/googleSignIn", googleSignIn);
router.get("/profile", authenticateJWT, getUser);
router.post("/add-follower", authenticateJWT, addFollowers);
router.post("/remove-follower", authenticateJWT, removeFollowers);
router.get("/all-users", authenticateJWT, getUsers);
router.post("/user-details", authenticateJWT, addUserDetails);
router.post("/profileImage/:id", authenticateJWT, uploadProfileImage);

export default router;
