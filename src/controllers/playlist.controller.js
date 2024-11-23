import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asynHandler} from "../utils/asynHandler.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"


const createPlaylist = asynHandler(async (req, res) => {

    try {
        const { name, description, videosId } = req.body;
        
        // Assuming `req.user._id` holds the authenticated user's ID
        const owner = req.user._id;

        // Validate videos exist if provided
        if (videosId && videosId.length > 0) {
            const foundVideos = await Video.find({ _id: { $in: videosId } });
            if (foundVideos.length !== videosId.length) {
                return res.status(400).json({ message: "Some videos were not found." });
            }
        }

        // Create a new playlist
        const playlist = new Playlist({
            name,
            description,
            videos: videosId,
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
})

const getUserPlaylists = asynHandler(async (req, res) => {

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

})

const getPlaylistById = asynHandler(async (req, res) => {
    const { playlistId } = req.params;

    try {

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

})

const addVideoToPlaylist = asynHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    try {
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

})

const removeVideoFromPlaylist = asynHandler(async (req, res) => {
    // const {playlistId, videoId} = req.params

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

})

const deletePlaylist = asynHandler(async (req, res) => {
    const {playlistId} = req.params

    try {
        // Check if the playlist exists
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: "Playlist not found." });
        }

        // Delete the playlist
        // await playlist.remove();
        await playlist.deleteOne();

        res.status(200).json({
            message: "Playlist deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "An error occurred while deleting the playlist",
            error: error.message,
        });
    }

})

const updatePlaylist = asynHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    try {
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