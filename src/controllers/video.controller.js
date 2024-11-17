import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynHandler } from "../utils/asynHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.uploadFile.js";
import { v2 as cloudinary } from "cloudinary";


const publishAVideo = asynHandler(async (req, res) => {
  const { title, description } = req.body;
  
  try {
    
    // Ensure video file and thumbnail are included in the request
    if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
      throw new ApiError(400, "Please provide video file and thumbnail.");
    }
    
    const thumbnailFilePath = req.files.thumbnail[0].path;
    const videoFilePath = req.files.videoFile[0].path;

    const thumbnailFile = await uploadOnCloudinary(thumbnailFilePath);
    const videoFile = await uploadOnCloudinary(videoFilePath);
    
    const videoDuration = videoFile.duration;

    // Create the video document
    const newVideo = new Video({
      videoFile: videoFile.url,
      thumbnail: thumbnailFile.url,
      title,
      description,
      duration: videoDuration, // Use the duration from the video upload result
      owner: req.user._id, // Assuming you have the user ID in the request
    });
    // Save the video document
    await newVideo.save();

    return res
      .status(201)
      .json(new ApiResponse(201, newVideo, "Video published successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while publishing the video");
  }
});

const getAllVideos = asynHandler(async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      // query,
      sortBy = "createdAt",
      sortType = "desc",
      userId,
    } = req.query;

    // Build the query object
    const filter = {};
    // if (query) {
    //   // Add filtering based on title or description
    //   filter.$or = [
    //     { title: { $regex: query, $options: "i" } }, // Case-insensitive search
    //     { description: { $regex: query, $options: "i" } },
    //   ];
    // }

    if (userId) {
      filter.owner = userId; // Filter by user ID if provided
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1; // 1 for ascending, -1 for descending

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
    throw new ApiError(500, "An error occurred while retrieving videos");
  }
});

const getVideoById = asynHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    // Find the video by its ID
    const video = await Video.findById(videoId).populate("owner"); // Populate owner field if needed

    // Check if the video exists
    if (!video) {
      throw new ApiError(404, "Video not found.");
    }

    // Return the video details
    return res
      .status(200)
      .json(new ApiResponse(201, video, "Video retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while retrieving the video");
  }
});

const updateVideo = asynHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  try {
    // Find the video by ID
    const video = await Video.findById(videoId);

    // Check if the video exists
    if (!video) {
      throw new ApiError(404, "Video not found.");
    }

    // Update the title and description if provided
    if (title) video.title = title;
    if (description) video.description = description;

    // Check if a new thumbnail is being uploaded
    if (req.files && req.files.thumbnail) {
      // Upload the new thumbnail to Cloudinary

      const thumbnailFilePath = req.files.thumbnail[0].path;
      await uploadOnCloudinary(thumbnailFilePath);
    }

    // Save the updated video document
    await video.save();

    return res
    .status(200)
    .json(new ApiResponse(201, video, "Video updated successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while updating the video");
  }
});

const deleteVideo = asynHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    // Find the video by ID
    const video = await Video.findById(videoId);

    // Check if the video exists
    if (!video) {
      throw new ApiError(404, "Video not found.");
      // return res.status(404).json({ message: "Video not found." });
    }

    // Extract the public_id from the video URL to delete from Cloudinary
    const videoPublicId = video.videoFile.split("/").pop().split(".")[0]; // Assumes video URL is in format: "https://res.cloudinary.com/<cloud_name>/video/upload/v<version>/<public_id>.<extension>"

    // Delete video from Cloudinary
    await cloudinary.uploader.destroy(videoPublicId, {
      resource_type: "video",
    });

    // Delete the video document from the database
    await Video.findByIdAndDelete(videoId);

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video deleted successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while deleting the video");
  }
});

const togglePublishStatus = asynHandler(async (req, res) => {
  const { videoId } = req.params;

  try {
    // Find the video by ID
    const video = await Video.findById(videoId);

    // Check if the video exists
    if (!video) {
      throw new ApiError(404, "Video not found.");
    }

    // Toggle the publish status
    video.isPublished = !video.isPublished;

    // Save the updated video document
    await video.save();

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video publish status updated successfully"));
  } catch (error) {
    throw new ApiError(500, "An error occurred while toggling the publish status");
  }
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
