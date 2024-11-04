import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asynHandler.js"


const createPlaylist = asynHandler(async (req, res) => {
    const {name, description} = req.body

    //TODO: create playlist
})

const getUserPlaylists = asynHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
})

const getPlaylistById = asynHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
})

const addVideoToPlaylist = asynHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
})

const removeVideoFromPlaylist = asynHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist

})

const deletePlaylist = asynHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
})

const updatePlaylist = asynHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}






/*

const Playlist = require("../models/Playlist");
const Video = require("../models/Video");
const User = require("../models/User");

// Controller for creating a playlist
exports.createPlaylist = async (req, res) => {
    try {
        const { name, description, videos } = req.body;
        
        // Assuming `req.user._id` holds the authenticated user's ID
        const owner = req.user._id;

        // Validate videos exist if provided
        if (videos && videos.length > 0) {
            const foundVideos = await Video.find({ _id: { $in: videos } });
            if (foundVideos.length !== videos.length) {
                return res.status(400).json({ message: "Some videos were not found." });
            }
        }

        // Create a new playlist
        const playlist = new Playlist({
            name,
            description,
            videos,
            owner
        });

        await playlist.save();

        res.status(201).json({
            message: "Playlist created successfully",
            playlist
        });
    } catch (error) {
        console.error("Error creating playlist:", error);
        res.status(500).json({ message: "Server error. Please try again." });
    }
};










 Controller for getting all playlists for a user

const asyncHandler = require("express-async-handler");
const Playlist = require("../models/Playlist");

// Controller to get all playlists of a specific user
const getUserPlaylists = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        // Find all playlists where the owner field matches the provided userId
        const playlists = await Playlist.find({ owner: userId }).populate("videos");

        if (!playlists || playlists.length === 0) {
            return res.status(404).json({ message: "No playlists found for this user." });
        }

        res.status(200).json({
            message: "User playlists retrieved successfully",
            playlists,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while retrieving user playlists",
            error: error.message,
        });
    }
});

module.exports = {
    getUserPlaylists,
};






const asyncHandler = require("express-async-handler");
const Playlist = require("../models/Playlist");

// Controller to get a specific playlist by its ID
const getPlaylistById = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;

        // Find the playlist by its ID and populate the videos field
        const playlist = await Playlist.findById(playlistId).populate("videos");

        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found." });
        }

        res.status(200).json({
            message: "Playlist retrieved successfully",
            playlist,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while retrieving the playlist",
            error: error.message,
        });
    }
});

module.exports = {
    getPlaylistById,
};






const asyncHandler = require("express-async-handler");
const Playlist = require("../models/Playlist");
const Video = require("../models/Video");

// Controller to add a video to a playlist
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;

        // Check if the playlist exists
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found." });
        }

        // Check if the video exists
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({ message: "Video not found." });
        }

        // Check if the video is already in the playlist
        if (playlist.videos.includes(videoId)) {
            return res.status(400).json({ message: "Video is already in the playlist." });
        }

        // Add the video to the playlist
        playlist.videos.push(videoId);
        await playlist.save();

        res.status(200).json({
            message: "Video added to playlist successfully",
            playlist,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while adding the video to the playlist",
            error: error.message,
        });
    }
});

module.exports = {
    addVideoToPlaylist,
};








const asyncHandler = require("express-async-handler");
const Playlist = require("../models/Playlist");

// Controller to remove a video from a playlist
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId, videoId } = req.params;

        // Check if the playlist exists
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found." });
        }

        // Check if the video exists in the playlist
        const videoIndex = playlist.videos.indexOf(videoId);
        if (videoIndex === -1) {
            return res.status(404).json({ message: "Video not found in the playlist." });
        }

        // Remove the video from the playlist
        playlist.videos.splice(videoIndex, 1);
        await playlist.save();

        res.status(200).json({
            message: "Video removed from playlist successfully",
            playlist,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while removing the video from the playlist",
            error: error.message,
        });
    }
});

module.exports = {
    removeVideoFromPlaylist,
};







const asyncHandler = require("express-async-handler");
const Playlist = require("../models/Playlist");

// Controller to delete a playlist
const deletePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;

        // Check if the playlist exists
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found." });
        }

        // Delete the playlist
        await playlist.remove();

        res.status(200).json({
            message: "Playlist deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while deleting the playlist",
            error: error.message,
        });
    }
});

module.exports = {
    deletePlaylist,
};





const asyncHandler = require("express-async-handler");
const Playlist = require("../models/Playlist");

// Controller to update a playlist
const updatePlaylist = asyncHandler(async (req, res) => {
    try {
        const { playlistId } = req.params;
        const { name, description } = req.body;

        // Check if the playlist exists
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found." });
        }

        // Update the playlist fields if provided
        if (name) playlist.name = name;
        if (description) playlist.description = description;

        // Save the updated playlist
        await playlist.save();

        res.status(200).json({
            message: "Playlist updated successfully",
            playlist,
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while updating the playlist",
            error: error.message,
        });
    }
});

module.exports = {
    updatePlaylist,
};


*/