import CommentReply from "../models/CommentReply.js";

export const postCommentReply = async (req, res) => {
  const { commentId, userId, commentText } = req.body;
  try {
    const result = await CommentReply.create({
      commentId,
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
export const updateCommentReply = async (req, res) => {
  const { id } = req.params;
  const { commentText } = req.body;
  try {
    const result = await CommentReply.findByIdAndUpdate(
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
