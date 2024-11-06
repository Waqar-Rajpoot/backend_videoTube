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
    console.log("userId", userId);
    
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

    const { tweetId } = req.params;
    const { content } = req.body;

    try {
        // Check if content is provided
        if (!content) {
            throw ApiError(404, "Content is required to update the tweet")        
        }

        // Find the tweet by ID
        const tweet = await Tweet.findById(tweetId);

        // Check if the tweet exists
        if (!tweet) {
            throw ApiError(404, "tweet not found");        
        }

        // Check if the logged-in user is the owner of the tweet
        if (tweet.owner.toString() !== req.user._id.toString()) {
            throw ApiError(403, "You are not authorized to update this tweet");
        }

        // Update the tweet's content
        tweet.content = content;
        const updatedTweet = await tweet.save();

        return res
        .status(200)
        .json( new ApiResponse( 200, updatedTweet, "Tweet updated successfully",));

    } catch (error) {
        throw new ApiError(500, "No tweets found to update for this user!!")  
    }


})

const deleteTweet = asynHandler(async (req, res) => {
    
    const { tweetId } = req.params;

    try {
        // Find the tweet by ID
        const tweet = await Tweet.findById(tweetId);

        // Check if the tweet exists
        if (!tweet) {
            throw new ApiError(404, "Tweet not found");
        }

        // Check if the logged-in user is the owner of the tweet
        if (tweet.owner.toString() !== req.user._id.toString()) {
            throw new ApiError(403, "You are not authorized to delete this tweet");        
        }

        // Delete the tweet
        await tweet.deleteOne();

        return res
        .status(200)
        .json( new ApiResponse( 200, {}, "Tweet deleted successfully",));

    } catch (error) {
        throw new ApiError(500, "An error occurred while deleting the tweet")
    }

})


export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}