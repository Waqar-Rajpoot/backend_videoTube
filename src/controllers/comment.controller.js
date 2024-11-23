import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynHandler } from "../utils/asynHandler.js";

const getVideoComments = async (req, res) => {
  try {
    const { videoId } = req.params;  // Assuming the video ID is passed as a route parameter

    // Fetch comments for the specific video
    const comments = await Comment.find({ video: videoId })
                                  .populate("owner", "fullName email")  // Populating owner to get user info (optional)
                                  .sort({ createdAt: -1 });  // Sorting comments by creation date, descending order

    // Check if comments exist
    if (!comments) {
      return res.status(404).json({ message: "No comments found for this video." });
    }

    // Return the comments
    return res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while fetching comments." });
  }
};
const addComment = asynHandler(async (req, res) => {
  const { content, videoId } = req.body; // Get content and videoId from request body
  const owner = req.user.id; // Assuming user is authenticated

  // Validate input
  if (!content || !videoId) {
    return res
      .status(400)
      .json({ message: "Content and video ID are required." });
  }

  try {
    // Create a new comment instance
    const newComment = new Comment({
      content,
      video: videoId,
      owner,
    });

    // Save the new comment to the database
    await newComment.save();

    // Respond with the newly created comment
    res
      .status(201)
      .json({ message: "Comment added successfully!", comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment.", error });
  }
});

const updateComment = asynHandler(async (req, res) => {
  const { commentId } = req.params; // Get the comment ID from the request parameters
  const { content } = req.body; // Get the updated content from the request body
  const owner = req.user.id; // Get the authenticated user's ID

  // Validate input
  if (!content) {
    return res.status(400).json({ message: "Content is required." });
  }

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.owner.toString() !== owner) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this comment." });
    }

    // Update the comment content
    comment.content = content;
    await comment.save();

    // Respond with the updated comment
    res.status(200).json({ message: "Comment updated successfully!", comment });
  } catch (error) {
    res.status(500).json({ message: "Failed to update comment.", error });
  }
});

const deleteComment = asynHandler(async (req, res) => {
  const { commentId } = req.params; // Get the comment ID from the request parameters
  const owner = req.user.id; // Get the authenticated user's ID

  try {
    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    // Check if the comment exists
    if (!comment) {
      return res.status(404).json({ message: "Comment not found." });
    }

    // Check if the authenticated user is the owner of the comment
    if (comment.owner.toString() !== owner) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment." });
    }

    // Delete the comment
    await comment.deleteOne();

    // Respond with a success message
    res.status(200).json({ message: "Comment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete comment.", error });
  }
});

export { 
    getVideoComments, 
    addComment, 
    updateComment, 
    deleteComment 
};
