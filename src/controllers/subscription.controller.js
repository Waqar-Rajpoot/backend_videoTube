import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynHandler } from "../utils/asynHandler.js";






const toggleSubscription = asynHandler(async (req, res) => {
  const { channelId } = req.params;
  const subscriberId = req.user.id; // Assuming you get subscriber ID from authenticated user

  try {
    // Check if the subscription already exists
    const existingSubscription = await Subscription.findOne({
      subscriber: subscriberId,
      channel: channelId,
    });

    if (existingSubscription) {
      // If it exists, unsubscribe (remove the subscription)
      await existingSubscription.remove();

      return res
        .status(200)
        .json(new ApiResponse(201, {}, "Unsubscribed successfully!"));
    } else {
      // If it doesn't exist, subscribe (create a new subscription)
      const newSubscription = new Subscription({
        subscriber: subscriberId,
        channel: channelId,
      });
      await newSubscription.save();

      return res
        .status(200)
        .json(new ApiResponse(201, {}, "Subscribed successfully!"));
    }
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while trying to subscribe or Unsubscribed",
      error
    );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynHandler(async (req, res) => {
  const { channelId } = req.params;

  try {
    // Find all subscriptions where the channel matches the provided channelId
    const subscribers = await Subscription.find({
      channel: channelId,
    }).populate("subscriber", "name email"); // Adjust fields as necessary (e.g., name, email)

    if (!subscribers.length) {
      throw new ApiError(404, "No subscribers found for this channel");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(201, subscribers, "Subscribers fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve subscribers.");
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asynHandler(async (req, res) => {
  const { subscriberId } = req.params;

  try {
    // Find all subscriptions where the subscriber matches the provided subscriberId
    const subscriptions = await Subscription.find({
      subscriber: subscriberId,
    }).populate("channel", "name description"); // Adjust fields as necessary (e.g., name, description)

    if (!subscriptions.length) {
      throw new ApiError(404, "No subscribed channels found for this user");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          201,
          subscriptions,
          "Subscriptions fetched successfully"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Failed to retrieve subscribed channels");
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
