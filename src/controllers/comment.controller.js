import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynHandler } from "../utils/asynHandler.js";

const getVideoComments = asynHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asynHandler(async (req, res) => {
  // TODO: add a comment to a video
});

const updateComment = asynHandler(async (req, res) => {
  // TODO: update a comment
});

const deleteComment = asynHandler(async (req, res) => {
  // TODO: delete a comment
});

export { getVideoComments,
    addComment, 
    updateComment, 
    deleteComment
};



/*





import { Comment } from "../models/commentModel.js"; // Adjust the path as necessary
import asyncHandler from "express-async-handler";

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params; // Get the videoId from request parameters
    const { page = 1, limit = 10 } = req.query; // Get pagination parameters from query

    try {
        // Build the aggregation pipeline to fetch comments for the video with pagination
        const options = {
            page: parseInt(page, 10), // Convert page to integer
            limit: parseInt(limit, 10), // Convert limit to integer
        };

        const comments = await Comment.aggregatePaginate(
            Comment.aggregate([
                { $match: { video: videoId } }, // Match comments for the specific video
                { $sort: { createdAt: -1 } }, // Sort comments by creation date (newest first)
                {
                    $lookup: {
                        from: "users", // Name of the user collection
                        localField: "owner",
                        foreignField: "_id",
                        as: "ownerDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$ownerDetails",
                        preserveNullAndEmptyArrays: true, // If there's no owner, keep the comment
                    },
                },
                {
                    $project: {
                        content: 1,
                        createdAt: 1,
                        "ownerDetails.name": 1,
                        "ownerDetails._id": 1,
                    },
                },
            ]),
            options
        );

        // If no comments found, respond with a message
        if (!comments.docs.length) {
            return res.status(404).json({ message: "No comments found for this video." });
        }

        // Respond with the paginated comments
        res.status(200).json({
            comments: comments.docs,
            totalPages: comments.totalPages,
            currentPage: comments.page,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve comments.", error });
    }
});

export default getVideoComments;







import { Comment } from "../models/commentModel.js"; // Adjust the path as necessary
import asyncHandler from "express-async-handler";

const addComment = asyncHandler(async (req, res) => {
    const { content, videoId } = req.body; // Get content and videoId from request body
    const owner = req.user.id; // Assuming user is authenticated

    // Validate input
    if (!content || !videoId) {
        return res.status(400).json({ message: "Content and video ID are required." });
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
        res.status(201).json({ message: "Comment added successfully!", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment.", error });
    }
});

export default addComment;







import { Comment } from "../models/commentModel.js"; // Adjust the path as necessary
import asyncHandler from "express-async-handler";

const updateComment = asyncHandler(async (req, res) => {
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
            return res.status(403).json({ message: "You are not authorized to update this comment." });
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

export default updateComment;








import { Comment } from "../models/commentModel.js"; // Adjust the path as necessary
import asyncHandler from "express-async-handler";

const deleteComment = asyncHandler(async (req, res) => {
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
            return res.status(403).json({ message: "You are not authorized to delete this comment." });
        }

        // Delete the comment
        await comment.remove();

        // Respond with a success message
        res.status(200).json({ message: "Comment deleted successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete comment.", error });
    }
});

export default deleteComment;






*/