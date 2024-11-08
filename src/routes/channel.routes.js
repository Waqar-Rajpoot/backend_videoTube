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
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file


// Create a new channel
router.route("/").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
      ]), createChannel);

router.route("/:channelId")
    .get(getChannelById)
    .put(updateChannel)
    .delete(deleteChannel);

router.route("/stats/:channelId").get(getChannelStats);
router.route("/search").get(searchChannels);

export default router;
