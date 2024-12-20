import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asynHandler.js"

const toggleVideoLike = asynHandler(async (req, res) => {
    const {videoId} = req.params

    const likedBy = req.user.id; // Assuming you have user authentication in place

    try {
        // Check if a like already exists for this user and the given video
        const existingLike = await Like.findOne({ likedBy, video: videoId });

        if (existingLike) {
            // If it exists, delete the like (unlike the video)
            await existingLike.deleteOne();
            return res.status(200).json({ message: "Unliked the video successfully!" });
        } else {
            // If it doesn't exist, create a new like for the video
            const newLike = new Like({ likedBy, video: videoId });
            await newLike.save();
            return res.status(201).json({ message: "Liked the video successfully!", like: newLike });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to toggle like on the video.", error });
    }
    
})

const toggleCommentLike = asynHandler(async (req, res) => {

    const { commentId } = req.params; // Get commentId from request parameters
    const likedBy = req.user.id; // Assuming you have user authentication in place

    try {
        // Check if a like already exists for this user and the given comment
        const existingLike = await Like.findOne({ likedBy, comment: commentId });

        if (existingLike) {
            // If it exists, remove the like (unlike the comment)
            await existingLike.deleteOne();
            return res.status(200).json({ message: "Unliked the comment successfully!" });
        } else {
            // If it doesn't exist, create a new like for the comment
            const newLike = new Like({ likedBy, comment: commentId });
            await newLike.save();
            return res.status(201).json({ message: "Liked the comment successfully!", like: newLike });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to toggle like on the comment.", error });
    }
})

const toggleTweetLike = asynHandler(async (req, res) => {

    const { tweetId } = req.params; // Get tweetId from request parameters
    const likedBy = req.user.id; // Assuming you have user authentication in place

    try {
        // Check if a like already exists for this user and the given tweet
        const existingLike = await Like.findOne({ likedBy, tweet: tweetId });

        if (existingLike) {
            // If it exists, remove the like (unlike the tweet)
            await existingLike.deleteOne();
            return res.status(200).json({ message: "Unliked the tweet successfully!" });
        } else {
            // If it doesn't exist, create a new like for the tweet
            const newLike = new Like({ likedBy, tweet: tweetId });
            await newLike.save();
            return res.status(201).json({ message: "Liked the tweet successfully!", like: newLike });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to toggle like on the tweet.", error });
    }

})


const getLikedVideos = asynHandler(async (req, res) => {

    const likedBy = req.user.id; // Assuming you have user authentication in place

    try {
        // Find all likes for videos by the authenticated user
        const likedVideos = await Like.find({ likedBy, video: { $ne: null } }) // Ensure we're only fetching video likes
            .populate("video", "title description videoFile") // Adjust fields as necessary
            // .populate("likedBy", "fullName email"); // Optionally populate likedBy to get user details

        if (!likedVideos.length) {
            return res.status(404).json({ message: "No liked videos found for this user." });
        }

        // Extract the video details from the likedVideos
        const videos = likedVideos.map(like => like.video);

        res.status(200).json({ likedVideos: videos });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve liked videos.", error });
    }

})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
