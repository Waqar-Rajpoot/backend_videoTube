// controllers/channelController.js
import { Channel } from "../models/channel.model.js";
import { Subscription } from "../models/subscription.model.js"; // Assuming you have a Subscription model
import { Video } from "../models/video.model.js"; // Assuming you have a Video model
import { Like } from "../models/like.model.js"; // Assuming you have a Like model
import { uploadOnCloudinary } from "../utils/cloudinary.uploadFile.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynHandler } from "../utils/asynHandler.js";

// 1. Create a New Channel
const createChannel = asynHandler(async (req, res) => {
  const {
    username,
    name,
    description,
    owner,
    tags,
    socialLinks,
    privacy,
  } = req.body;  

  console.log(username);
  

  try {

     // Check user already exist
    const existedUser = await Channel.findOne({ username });
    // console.log(existedUser); assignment

    if (existedUser) {
      throw new ApiError(409, "Username already exist...");
    }


    // Validation check
    if (!(name && owner)) {
      throw new ApiError(400, "Name and owner are required");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(404, "Avatar is required!!");
  }

  let coverImageLocalpath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalpath = req.files.coverImage[0].path;
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalpath);

  if (!avatar) {
    throw new ApiError(404, "Avatar is required!!!");
  }

    const channel = new Channel({
      username,
      name,
      description,
      owner,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      tags,
      socialLinks,
      privacy,
    });

    await channel.save();
    
    return res
      .status(200)
      .json(new ApiResponse(201, channel, "Channel created successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while creating the channel.");
  }
});

// 2. Get Channel Details by ID
const getChannelById = asynHandler(async (req, res) => {
  const { channelId } = req.params;

  try {
    // Find the channel by ID and populate related fields (e.g., owner details)
    const channel = await Channel.findById(channelId)
      // .populate("owner", "username avatar") // Customize fields to populate from the owner
      // .populate("subscribers", "username email") // Populate subscriber details if required
      // .exec();

    // Check if the channel exists
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    // Send channel details in the response
    return res
      .status(200)
      .json(new ApiResponse(201, channel, "Channel retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while retrieving the channel.");
  }
});

// 3. Update Channel Information
const updateChannel = asynHandler(async (req, res) => {
  const { channelId } = req.params;
  const updates = req.body;

  try {
    // Find the channel by ID
    const channel = await Channel.findById(channelId);

    // Check if the channel exists
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    // Check if the request's user is the channel owner (assuming req.user contains the logged-in user data)
    if (channel.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        404,
        "You do not have permission to update this channel"
      );
    }

    // Define fields that are allowed to be updated
    const allowedUpdates = [
      "name",
      "description",
      "tags",
      "socialLinks",
      "privacy",
    ];
    const isValidUpdate = Object.keys(updates).every((key) =>
      allowedUpdates.includes(key)
    );

    if (!isValidUpdate) {
      throw new ApiError(
        400,
        "Invalid updates, allowed fields: name, description, avatar, coverImage, tags, socialLinks, privacy"
      );
    }

    // Update channel fields selectively
    Object.keys(updates).forEach((key) => {
      channel[key] = updates[key];
    });

    // Save the updated channel to the database
    await channel.save();

    return res
      .status(200)
      .json(new ApiResponse(201, channel, "Channel updated successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while updating the channel.");
  }
});

// 4. Delete a Channel
const deleteChannel = asynHandler(async (req, res) => {
  const { channelId } = req.params;
  try {
    // Find the channel by ID
    const channel = await Channel.findById(channelId);

    // Check if the channel exists
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    // Check if the request's user is the channel owner (assuming req.user contains the logged-in user data)
    if (channel.owner.toString() !== req.user._id.toString()) {
      throw new ApiError(
        403,
        "You do not have permission to delete this channel"
      );
    }

    // Delete the channel
    await channel.remove();

    return res
      .status(200)
      .json(new ApiResponse(201, {}, "Channel deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while deleting the channel.");
  }
});

// 5. Get Channel Stats (views, subscribers, etc.)
const getChannelStats = asynHandler(async (req, res) => {
  const { channelId } = req.params;

  try {
    // Find the channel by ID
    const channel = await Channel.findById(channelId);

    // Check if the channel exists
    if (!channel) {
      throw new ApiError(404, "Channel not found");
    }

    // Fetch statistics
    const totalSubscribers = await Subscription.countDocuments({
      channel: channelId,
    });
    const totalVideos = await Video.countDocuments({ channel: channelId });
    const totalLikes = await Like.countDocuments({
      video: { $in: await Video.find({ channel: channelId }).select("_id") },
    });
    const totalViews =
      totalVideos > 0
        ? await Video.aggregate([
            { $match: { channel: channelId } },
            { $group: { _id: null, totalViews: { $sum: "$views" } } },
          ])
        : [{ totalViews: 0 }]; // Set default to 0 if no videos

    // Compile the statistics
    const stats = {
      totalSubscribers,
      totalVideos,
      totalLikes,
      totalViews: totalViews[0]?.totalViews || 0, // Access totalViews safely
    };

    return res
      .status(200)
      .json(
        new ApiResponse(201, stats, "Channel statistics retrieved successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      "An error occurred while retrieving channel statistics."
    );
  }
});

// 6. Search Channels by Name or Tags
const searchChannels = asynHandler(async (req, res) => {
  const { query } = req.query;

  // Validate input
  if (!query || query.trim().length < 1) {
    throw new ApiError(400, "Search query cannot be empty");
  }

  try {
    // Perform the search on channel name and description
    const channels = await Channel.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive match for name
        { description: { $regex: query, $options: "i" } }, // Case-insensitive match for description
      ],
    });

    // Check if any channels were found
    if (channels.length === 0) {
      throw new ApiError(
        404,
        "No channels found matching your search criteria"
      );
    }

    return res
      .status(200)
      .json(new ApiResponse(201, channels, "Channels retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while searching for channels.");
  }
});

export {
  createChannel,
  getChannelById,
  updateChannel,
  deleteChannel,
  getChannelStats,
  searchChannels,
};
