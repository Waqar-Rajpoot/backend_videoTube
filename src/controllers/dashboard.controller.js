import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asynHandler.js"

const getChannelStats = asynHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asynHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
})

export {
    getChannelStats, 
    getChannelVideos
}




/*  

import { Video } from "../models/videoModel.js"; // Adjust the path as necessary
import { Subscription } from "../models/subscriptionModel.js"; // Adjust the path as necessary
import { Like } from "../models/likeModel.js"; // Adjust the path as necessary
import asyncHandler from "express-async-handler";

const getChannelStats = asyncHandler(async (req, res) => {
    const { channelId } = req.params; // Get the channel ID from the request parameters

    try {
        // Get total subscribers
        const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

        // Get total videos
        const totalVideos = await Video.countDocuments({ owner: channelId });

        // Get total likes across all videos
        const totalLikes = await Like.countDocuments({ video: { $in: await Video.find({ owner: channelId }).select('_id') } });

        // Get total views across all videos
        const totalViews = await Video.aggregate([
            { $match: { owner: channelId } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } }
        ]);

        // If there are no videos, set total views to 0
        const viewsCount = totalViews.length > 0 ? totalViews[0].totalViews : 0;

        // Respond with channel stats
        res.status(200).json({
            totalSubscribers,
            totalVideos,
            totalLikes,
            totalViews: viewsCount,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve channel stats.", error });
    }
});

export default getChannelStats;








import { Video } from "../models/videoModel.js"; // Adjust the path as necessary
import asyncHandler from "express-async-handler";

const getChannelVideos = asyncHandler(async (req, res) => {
    const { channelId } = req.params; // Get the channel ID from the request parameters
    const { page = 1, limit = 10 } = req.query; // Get pagination parameters from the query string

    // Convert page and limit to numbers
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber; // Calculate skip value

    try {
        // Get the videos for the channel with pagination
        const videos = await Video.find({ owner: channelId }) // Find videos by channel ID
            .skip(skip) // Skip the number of videos based on pagination
            .limit(limitNumber) // Limit the number of videos returned
            .sort({ createdAt: -1 }); // Sort videos by creation date in descending order

        // Get total video count for the channel
        const totalVideos = await Video.countDocuments({ owner: channelId });

        // Respond with the videos and total count
        res.status(200).json({
            totalVideos,
            videos,
            page: pageNumber,
            limit: limitNumber,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve channel videos.", error });
    }
});

export default getChannelVideos;


*/