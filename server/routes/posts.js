import express from "express";

import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  likePost,
  deletePost,
  getUsersPost,
  getRelatedPosts,
  getRecentPosts,
  getCategoriesOfPosts,
  getFavouritePosts,
  addToFavourite,
  removeFromFavourites,
} from "../controllers/posts.js";
import { postComment, updateComment } from "../controllers/comment.js";
import { authenticateJWT } from "../middleware/auth.js";
import {
  postCommentReply,
  updateCommentReply,
} from "../controllers/commentReply.js";

const router = express.Router();

router.get("/favourite",authenticateJWT, getFavouritePosts);
router.post("/related", getRelatedPosts);
router.get("/recent-posts", getRecentPosts);
router.get("/categories", getCategoriesOfPosts);
router.post("/comment", postComment);
router.post("/comment", postComment);
router.post("/comment-reply", postCommentReply);
router.patch("/update-comment/:id", updateComment);
router.patch("/update-comment-reply/:id", updateCommentReply);
router.get("/favourite/:id",authenticateJWT, addToFavourite);
router.get("/remove-favourite/:id",authenticateJWT, removeFromFavourites);

router.get("/",authenticateJWT, getPosts);
router.post("/", authenticateJWT, createPost);
router.get("/:id", getPost);

router.get("/me/:id", getUsersPost);
router.patch("/:id", authenticateJWT, updatePost);
router.delete("/:id", authenticateJWT, deletePost);
router.patch("/:id/like", authenticateJWT, likePost);

export default router;
