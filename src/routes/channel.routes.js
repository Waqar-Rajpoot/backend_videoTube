// routes/channelRoutes.js
import express from "express";
import {
    createChannel,
    getChannelById,
    updateChannel,
    deleteChannel,
    getChannelStats,
    searchChannels
} from "../controllers/channel.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file


// Create a new channel
router.post("/", createChannel);
router
    .get("/:channelId", getChannelById)
    .put("/:channelId", updateChannel)
    .delete("/:channelId", deleteChannel);
router.get("/:channelId/stats", getChannelStats);
router.get("/search", searchChannels);

export default router;
