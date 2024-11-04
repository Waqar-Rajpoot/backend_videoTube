import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asynHandler.js"


// Controller to create a new tweet
const createTweet = asynHandler(async (req, res) => {

// Controller to create a new tweet
    const { content } = req.body;

    // Check if content is provided
    if (!content) {
       throw new ApiError(400, "Content is required to create a tweet")
    }

    try {
        // Create a new tweet associated with the logged-in user
        const tweet = await Tweet.create({
            content,
            owner: req.user._id, // Assuming `req.user` contains the logged-in user's data
        });

        return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"));

    } catch (error) {
       throw new ApiError(500, "An error occurred while creating the tweet")
    }
});








const getUserTweets = asynHandler(async (req, res) => {

    const { userId } = req.params;
    
    try {
        // Find all tweets where the owner field matches the provided userId
        const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

        if (!tweets || tweets.length === 0) {
           throw new ApiError(404, "No tweets found for this user")  
        }

        return res
        .status(200)
        .json(new ApiResponse(201, tweets, "tweets fetched successfully"));
        
    } catch (error) {

        throw new ApiError(500, "No tweets found for this user!!")  
    }

})






const updateTweet = asynHandler(async (req, res) => {
    //TODO: update tweet
})

const deleteTweet = asynHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}



/*  




const asyncHandler = require("express-async-handler");
const Tweet = require("../models/Tweet");

// Controller to get all tweets of a specific user
const getUserTweets = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        // Find all tweets where the owner field matches the provided userId
        const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

        if (!tweets || tweets.length === 0) {
            return res.status(404).json({ message: "No tweets found for this user." });
        }

        res.status(200).json({
            message: "User tweets retrieved successfully",
            tweets,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while retrieving the user's tweets",
            error: error.message,
        });
    }
});

module.exports = {
    getUserTweets,
};






const asyncHandler = require("express-async-handler");
const Tweet = require("../models/Tweet");

// Controller to update a tweet
const updateTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    const { content } = req.body;

    try {
        // Check if content is provided
        if (!content) {
            return res.status(400).json({ message: "Content is required to update the tweet." });
        }

        // Find the tweet by ID
        const tweet = await Tweet.findById(tweetId);

        // Check if the tweet exists
        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found." });
        }

        // Check if the logged-in user is the owner of the tweet
        if (tweet.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to update this tweet." });
        }

        // Update the tweet's content
        tweet.content = content;
        const updatedTweet = await tweet.save();

        res.status(200).json({
            message: "Tweet updated successfully",
            updatedTweet,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating the tweet",
            error: error.message,
        });
    }
});

module.exports = {
    updateTweet,
};






const asyncHandler = require("express-async-handler");
const Tweet = require("../models/Tweet");

// Controller to delete a tweet
const deleteTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;

    try {
        // Find the tweet by ID
        const tweet = await Tweet.findById(tweetId);

        // Check if the tweet exists
        if (!tweet) {
            return res.status(404).json({ message: "Tweet not found." });
        }

        // Check if the logged-in user is the owner of the tweet
        if (tweet.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this tweet." });
        }

        // Delete the tweet
        await tweet.deleteOne();

        res.status(200).json({
            message: "Tweet deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while deleting the tweet",
            error: error.message,
        });
    }
});

module.exports = {
    deleteTweet,
};











*/