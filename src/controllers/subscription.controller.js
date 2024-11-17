import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynHandler } from "../utils/asynHandler.js";



const toggleSubscription = asynHandler(async (req, res) => {
  const { subscribedToId } = req.params;
  const subscriberId = req.user.id; // Assuming you get subscriber ID from authenticated user

  console.log(subscribedToId, subscriberId);
  
  try {
    // const { subscriberId, subscribedToId } = req.body;

    // Validate inputs
    if (!subscriberId || !subscribedToId) {
      return res.status(400).json({ message: "Subscriber and channel to subscribe to are required." });
    }

    // Check if subscription exists
    const existingSubscription = await Subscription.findOne({
      subscriber: subscriberId,
      subscribedTo: subscribedToId,
    });

    if (existingSubscription) {
      // If the subscription exists, unsubscribe by deleting the subscription
      await Subscription.deleteOne({
        subscriber: subscriberId,
        subscribedTo: subscribedToId,
      });
      return res.status(200).json({ message: "Unsubscribed successfully" });
    } else {
      // If no subscription exists, create a new one to subscribe
      const newSubscription = new Subscription({
        subscriber: subscriberId,
        subscribedTo: subscribedToId,
      });

      await newSubscription.save();
      return res.status(200).json({ message: "Subscribed successfully" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while toggling subscription." });
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asynHandler(async (req, res) => {
  try {
    const { channelId } = req.params;  // Get channel ID from the URL parameter

    // Validate channelId
    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required." });
    }

    // Find all subscriptions where the 'subscribedTo' field matches the channelId
    const subscriptions = await Subscription.find({ subscribedTo: channelId })
      .populate('subscriber', 'name email')  // Populate the subscriber field with relevant user details
      .exec();

    if (subscriptions.length === 0) {
      return res.status(404).json({ message: "No subscribers found for this channel." });
    }

    // Extract only the subscriber details
    const subscribers = subscriptions.map(sub => sub.subscriber);

    // Return the list of subscribers
    return res.status(200).json({ subscribers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while fetching subscribers." });
  }
});

const getSubscribedChannels = asynHandler (async (req, res) => {
  try {
    const { channelId } = req.params;  // Get the channelId from the URL parameters

    // Validate the channelId
    if (!channelId) {
      return res.status(400).json({ message: "Channel ID is required." });
    }

    // Find all subscriptions where the 'subscriber' is the provided channelId
    const subscriptions = await Subscription.find({ subscriber: channelId })
      .populate('subscribedTo', 'name description')  // Populate the 'subscribedTo' field with channel details
      .exec();

    if (subscriptions.length === 0) {
      return res.status(404).json({ message: "No subscribed channels found for this channel." });
    }

    // Extract the 'subscribedTo' details (channels)
    const subscribedChannels = subscriptions.map(sub => sub.subscribedTo);

    // Return the list of channels this channel has subscribed to
    return res.status(200).json({ subscribedChannels });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while fetching subscribed channels." });
  }
});


// controller to return channel list to which user has subscribed
// const getSubscribedChannels = asynHandler(async (req, res) => {
//   const { channelId } = req.params;

//   const subscriberId = channelId;

//   console.log(subscriberId);

//   try {
//     // Find all subscriptions where the subscriber matches the provided subscriberId
//     const subscriptions = await Subscription.find({
//       subscriber: subscriberId,
//     })
//     .populate("channel", "name, description"); // Adjust fields as necessary (e.g., name, description)

//     console.log(subscriptions);

//     if (!subscriptions.length) {
//       throw new ApiError(404, "No subscribed channels found for this user");
//     }

//     return res
//       .status(200)
//       .json(
//         new ApiResponse(
//           201,
//           subscriptions,
//           "Subscriptions fetched successfully"
//         )
//       );
//   } catch (error) {
//     throw new ApiError(500, "Failed to retrieve subscribed channels");
//   }
// });

// controllers/subscriptionController.js

// Controller to get channels the authenticated user has subscribed to
// const getSubscribedChannels = async (req, res) => {
//   try {
//     const userId = req.user._id; // Assume user ID is available on `req.user`

//     // Find all subscriptions where the subscriber is the logged-in user
//     const subscriptions = await Subscription.find({ subscriber: userId })
//       .populate("channel", "name description") // Adjust fields as necessary

//       console.log(subscriptions[0].subscriber);

//     if (!subscriptions || subscriptions.length === 0) {
//       return res.status(404).json({ message: "You have not subscribed to any channels." });
//     }

//     // Extract channel information from subscriptions
//     const subscribersId = subscriptions.map(subscription => subscription.subscriber);

//     // console.log(channels.length);

//     res.status(200).json({ subscribersId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "An error occurred while fetching subscribed channels", error });
//   }
// };

// Controller to get all subscribers of a specific channel
// const getSubscribersOfChannel = async (req, res) => {
//   try {
//     const channelId = req.params.channelId; // Get the channel ID from the request parameters

//     // Find all subscriptions where the channel matches the provided channelId
//     const subscriptions = await Subscription.find({
//       channel: channelId,
//     }).populate("subscriber", "name email"); // Populate subscriber with necessary fields

//     // Extract the subscriber information (only subscriber details, not the whole subscription object)
//     const subscribers = subscriptions.map(
//       (subscription) => subscription.subscriber
//     );

//     // Send the response with the list of subscribers
//     return res.status(200).json({ subscribers });
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };





export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
};
