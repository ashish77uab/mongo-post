import mongoose from "mongoose";
import fs from "fs";
import Post from "../models/Post.js";

export const getPosts = async (req, res) => {
  const { search, tag, page } = req.query;
  const user = req.user;

  try {
    const favouritePosts = await FavouritePost.find({ userId: user.id });
    const favouritePostsArr = favouritePosts.map((item) =>
      item.post.toString()
    );
    const LIMIT = 12;
    const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
    if (search) {
      const Search = new RegExp(search, "i");
      const total = await Post.find({ title: Search }).count();
      const posts = await Post.find({ title: Search })
        .limit(LIMIT)
        .skip(startIndex);
      const sortedPost = posts.map((post) => {
        if (favouritePostsArr.includes(post._id.toString())) {
          return { ...post._doc, isFavourite: true };
        } else {
          return { ...post._doc, isFavourite: false };
        }
      });
      res.status(200).json({
        data: sortedPost,
        currentPage: Number(page),
        numberOfPages: Math.ceil(total / LIMIT),
      });
    } else if (tag) {
      const total = await Post.find({ tags: { $in: tag } }).count();
      const posts = await Post.find({ tags: { $in: tag } })
        .limit(LIMIT)
        .skip(startIndex);
      const sortedPost = posts.map((post) => {
        if (favouritePostsArr.includes(post._id.toString())) {
          return { ...post._doc, isFavourite: true };
        } else {
          return { ...post._doc, isFavourite: false };
        }
      });
      res.status(200).json({
        data: sortedPost,
        currentPage: Number(page),
        numberOfPages: Math.ceil(total / LIMIT),
      });
    } else {
      const total = await Post.countDocuments({});
      const posts = await Post.find()
        .sort({ createdAt: -1 })
        .limit(LIMIT)
        .skip(startIndex);

      const sortedPost = posts.map((post) => {
        if (favouritePostsArr.includes(post._id.toString())) {
          return { ...post._doc, isFavourite: true };
        } else {
          return { ...post._doc, isFavourite: false };
        }
      });

      res.status(200).json({
        data: sortedPost,
        currentPage: Number(page),
        numberOfPages: Math.ceil(total / LIMIT),
      });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findOne({ _id: id }).populate({
      path: "parentComment",
      populate: [
        {
          path: "commentReply",
          populate: {
            path: "user",
          },
        },
        {
          path: "user",
        },
      ],
    });

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getFavouritePosts = async (req, res) => {
  const user = req.user;
  const { page } = req.query;
  const LIMIT = 12;
  const startIndex = (Number(page) - 1) * LIMIT;
  if (!mongoose.Types.ObjectId.isValid(user.id)) {
    return res.status(404).json({ message: "User doesn't exist" });
  }
  try {
    const total = await FavouritePost.find({ userId: user.id }).count();
    const favouritePosts = await FavouritePost.find({ userId: user.id })
      .populate({
        path: "post",
      })
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      data: favouritePosts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const newPost = new Post({ ...req.body });

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const addToFavourite = async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const favouritePostAlreadyExist = await FavouritePost.findOne({
      post: id,
      userId: user.id,
    });
    if (favouritePostAlreadyExist) {
      FavouritePost.deleteOne({ post: id, userId: user.id });
    } else {
      await FavouritePost.create({ post: id, userId: user.id });
    }
    res.status(201).json({ message: "Added to favourite successfully" });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const removeFromFavourites = async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  try {
    await FavouritePost.deleteOne({ post: id, userId: user.id });
    res.status(201).json({
      message: "Removed from favourite successfully",
    });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};
export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, creator, selectedFile, tags } = req.body;
  const oldPost = await Post.findOne({ _id: id });
  const fileName = oldPost.selectedFile;

  try {
    if (selectedFile !== fileName) {
      fs.unlinkSync("./uploads/" + fileName);
    }
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No post with id: ${id}`);
    const updatedPost = {
      creator,
      title,
      message,
      tags,
      selectedFile,
      _id: id,
    };
    await Post.findByIdAndUpdate(id, updatedPost, { new: true });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).send({
      message: "Could not delete the file. " + err,
    });
  }
};
export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);

  await Post.findByIdAndRemove(id);

  res.status(201).json({ message: "Post deleted successfully." });
};
export const getUsersPost = async (req, res) => {
  const { id } = req.params;
  const { page } = req.query;
  const LIMIT = 12;
  const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User doesn't exist" });
  }
  const total = await Post.find({ creator: id }).count();
  const userPosts = await Post.find({ creator: id })
    .sort({ createdAt: -1 })
    .limit(LIMIT)
    .skip(startIndex);
  res.status(200).json({
    data: userPosts,
    currentPage: Number(page),
    numberOfPages: Math.ceil(total / LIMIT),
  });
};

export const likePost = async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.user) {
      return res.json({ message: "User is not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No posts exist with id: ${id}` });
    }

    const tour = await Post.findById(id);

    const index = tour.likes.findIndex((id) => id === String(req.user.id));

    if (index === -1) {
      tour.likes.push(req.user.id);
    } else {
      tour.likes = tour.likes.filter((id) => id !== String(req.user.id));
    }

    const updatedPost = await Post.findByIdAndUpdate(id, tour, {
      new: true,
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
export const getRelatedPosts = async (req, res) => {
  const { tags } = req.body;

  try {
    const Posts = await Post.find({ tags: { $in: tags } }).limit(4);
    res.json(Posts);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const getRecentPosts = async (req, res) => {
  try {
    const Posts = await Post.find().sort({ createdAt: -1 }).limit(5);
    res.json(Posts);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const getCategoriesOfPosts = async (req, res) => {
  try {
    const Posts = await Post.find();
    const tags = Posts.flatMap((item) => item.tags);
    const filteredTags = tags.filter(
      (item, index) => tags.indexOf(item) === index && item
    );
    res.json(filteredTags);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
