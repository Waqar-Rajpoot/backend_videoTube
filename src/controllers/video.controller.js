import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asynHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.uploadFile.js"


const getAllVideos = asynHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asynHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
})

const getVideoById = asynHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asynHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asynHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asynHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}



/*


const asyncHandler = require("express-async-handler");
const Video = require("../models/Video");

// Controller to get all videos
const getAllVideos = asyncHandler(async (req, res) => {
    try {
        const { page = 1, limit = 10, query, sortBy = 'createdAt', sortType = 'desc', userId } = req.query;

        // Build the query object
        const filter = {};
        if (query) {
            // Add filtering based on title or description
            filter.$or = [
                { title: { $regex: query, $options: 'i' } }, // Case-insensitive search
                { description: { $regex: query, $options: 'i' } }
            ];
        }

        if (userId) {
            filter.owner = userId; // Filter by user ID if provided
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortType === 'asc' ? 1 : -1; // 1 for ascending, -1 for descending

        // Pagination calculation
        const skip = (page - 1) * limit;

        // Fetch videos with pagination, sorting, and filtering
        const videos = await Video.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate("owner"); // Populate owner field if needed

        // Count total videos for pagination
        const totalVideos = await Video.countDocuments(filter);

        res.status(200).json({
            message: "Videos retrieved successfully",
            videos,
            totalPages: Math.ceil(totalVideos / limit),
            currentPage: parseInt(page),
            totalVideos,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while retrieving videos",
            error: error.message,
        });
    }
});

module.exports = {
    getAllVideos,
};






const asyncHandler = require("express-async-handler");
const Video = require("../models/Video");
const cloudinary = require("cloudinary").v2; // Make sure to configure Cloudinary

// Controller to publish a video
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    try {
        // Ensure video file and thumbnail are included in the request
        if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
            return res.status(400).json({ message: "Please provide video file and thumbnail." });
        }

        const videoFile = req.files.videoFile;
        const thumbnailFile = req.files.thumbnail;

        // Upload video to Cloudinary
        const videoUploadResult = await cloudinary.uploader.upload(videoFile.tempFilePath, {
            resource_type: "video" // Specify resource type as video
        });

        // Get video duration from the uploaded video
        const videoDuration = videoUploadResult.duration; // Duration in seconds

        // Upload thumbnail to Cloudinary
        const thumbnailUploadResult = await cloudinary.uploader.upload(thumbnailFile.tempFilePath, {
            resource_type: "image" // Specify resource type as image
        });

        // Create the video document
        const newVideo = new Video({
            videoFile: videoUploadResult.secure_url, // Cloudinary URL for the video
            thumbnail: thumbnailUploadResult.secure_url, // Cloudinary URL for the thumbnail
            title,
            description,
            duration: videoDuration, // Use the duration from the video upload result
            owner: req.user._id // Assuming you have the user ID in the request
        });

        // Save the video document
        await newVideo.save();

        res.status(201).json({
            message: "Video published successfully",
            video: newVideo
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while publishing the video",
            error: error.message,
        });
    }
});

module.exports = {
    publishAVideo,
};






const asyncHandler = require("express-async-handler");
const Video = require("../models/Video");

// Controller to get video by ID
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    try {
        // Find the video by its ID
        const video = await Video.findById(videoId).populate("owner"); // Populate owner field if needed

        // Check if the video exists
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        // Return the video details
        res.status(200).json({
            message: "Video retrieved successfully",
            video,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while retrieving the video",
            error: error.message,
        });
    }
});

module.exports = {
    getVideoById,
};






const asyncHandler = require("express-async-handler");
const Video = require("../models/Video");
const cloudinary = require("cloudinary").v2; // Ensure Cloudinary is configured

// Controller to update video details
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    try {
        // Find the video by ID
        const video = await Video.findById(videoId);

        // Check if the video exists
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        // Update the title and description if provided
        if (title) video.title = title;
        if (description) video.description = description;

        // Check if a new thumbnail is being uploaded
        if (req.files && req.files.thumbnail) {
            // Upload the new thumbnail to Cloudinary
            const thumbnailFile = req.files.thumbnail;
            const thumbnailUploadResult = await cloudinary.uploader.upload(thumbnailFile.tempFilePath, {
                resource_type: "image", // Specify resource type as image
            });

            // Update the thumbnail URL in the video document
            video.thumbnail = thumbnailUploadResult.secure_url; // Cloudinary URL for the thumbnail
        }

        // Save the updated video document
        await video.save();

        res.status(200).json({
            message: "Video updated successfully",
            video,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating the video",
            error: error.message,
        });
    }
});

module.exports = {
    updateVideo,
};







const asyncHandler = require("express-async-handler");
const Video = require("../models/Video");
const cloudinary = require("cloudinary").v2; // Ensure Cloudinary is configured

// Controller to delete a video
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    try {
        // Find the video by ID
        const video = await Video.findById(videoId);

        // Check if the video exists
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        // Extract the public_id from the video URL to delete from Cloudinary
        const videoPublicId = video.videoFile.split('/').pop().split('.')[0]; // Assumes video URL is in format: "https://res.cloudinary.com/<cloud_name>/video/upload/v<version>/<public_id>.<extension>"

        // Delete video from Cloudinary
        await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });

        // Delete the video document from the database
        await Video.findByIdAndDelete(videoId);

        res.status(200).json({
            message: "Video deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while deleting the video",
            error: error.message,
        });
    }
});

module.exports = {
    deleteVideo,
};





const asyncHandler = require("express-async-handler");
const Video = require("../models/Video");

// Controller to toggle the publish status of a video
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    try {
        // Find the video by ID
        const video = await Video.findById(videoId);

        // Check if the video exists
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        // Toggle the publish status
        video.isPublished = !video.isPublished;

        // Save the updated video document
        await video.save();

        res.status(200).json({
            message: "Video publish status updated successfully",
            video,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while toggling the publish status",
            error: error.message,
        });
    }
});

module.exports = {
    togglePublishStatus,
};


















import asyncHandler from "express-async-handler";
import { Video } from "../models/Video.js"; // Assuming the file is Video.js

// Controller to create a new video
const createVideo = asyncHandler(async (req, res) => {
    try {
        const { videoFile, thumbnail, title, description, duration, isPublished } = req.body;
        const owner = req.user._id; // Assuming user info is stored in req.user by authentication middleware

        // Check for required fields
        if (!videoFile || !thumbnail || !title || !description || !duration) {
            return res.status(400).json({ message: "All required fields must be provided." });
        }

        // Create the new video document
        const video = new Video({
            videoFile,
            thumbnail,
            title,
            description,
            duration,
            isPublished: isPublished ?? true, // Default to true if isPublished is not provided
            owner,
        });

        // Save the video to the database
        await video.save();

        res.status(201).json({
            message: "Video created successfully",
            video,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while creating the video",
            error: error.message,
        });
    }
});

export { createVideo };


*/