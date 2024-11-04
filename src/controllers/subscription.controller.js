import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asynHandler.js"


const toggleSubscription = asynHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynHandler(async (req, res) => {
    const {channelId} = req.params
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynHandler(async (req, res) => {
    const { subscriberId } = req.params
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}



/*


import { Subscription } from "../models/subscriptionModel.js";
import asyncHandler from "express-async-handler";  // Assuming you're using asyncHandler to handle async errors

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    const subscriberId = req.user.id; // Assuming you get subscriber ID from authenticated user

    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({ subscriber: subscriberId, channel: channelId });

    if (existingSubscription) {
        // If it exists, unsubscribe (remove the subscription)
        await existingSubscription.remove();
        return res.status(200).json({ message: "Unsubscribed successfully!" });
    } else {
        // If it doesn't exist, subscribe (create a new subscription)
        const newSubscription = new Subscription({ subscriber: subscriberId, channel: channelId });
        await newSubscription.save();
        return res.status(201).json({ message: "Subscribed successfully!", subscription: newSubscription });
    }
});

export default toggleSubscription;





import { Subscription } from "../models/subscriptionModel.js";
import asyncHandler from "express-async-handler";  // Assuming asyncHandler is being used to handle errors

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    try {
        // Find all subscriptions where the channel matches the provided channelId
        const subscribers = await Subscription.find({ channel: channelId })
            .populate("subscriber", "name email") // Adjust fields as necessary (e.g., name, email)

        if (!subscribers.length) {
            return res.status(404).json({ message: "No subscribers found for this channel." });
        }

        res.status(200).json({ subscribers });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve subscribers.", error });
    }
});

export default getUserChannelSubscribers;

Route
router.get("/channel-subscribers/:channelId", getUserChannelSubscribers);






import { Subscription } from "../models/subscriptionModel.js";
import asyncHandler from "express-async-handler"; // Assuming asyncHandler is being used to handle errors

const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    try {
        // Find all subscriptions where the subscriber matches the provided subscriberId
        const subscriptions = await Subscription.find({ subscriber: subscriberId })
            .populate("channel", "name description") // Adjust fields as necessary (e.g., name, description)

        if (!subscriptions.length) {
            return res.status(404).json({ message: "No subscribed channels found for this user." });
        }

        res.status(200).json({ subscribedChannels: subscriptions });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve subscribed channels.", error });
    }
});

export default getSubscribedChannels;








*/