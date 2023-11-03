import Comment from "../models/Comment.js";

export const postComment = async (req, res) => {
  const { postId, userId, commentText } = req.body;
  try {
    const result = await Comment.create({
      postId,
      userId,
      commentText,
      user: userId,
    });
    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { commentText } = req.body;
  try {
    const result = await Comment.findByIdAndUpdate(
      { _id: id },
      {
        commentText,
      },
      { new: true }
    );
    res.status(201).json({ result });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};
