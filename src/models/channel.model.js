// models/channelModel.js
import mongoose, { Schema } from "mongoose";

const channelSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        description: {
            type: String,
            maxlength: 500
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        avatar: {
            type: String, // URL for channel's avatar image
            default: ""
        },
        coverImage: {
            type: String, // URL for channel's cover image
            default: ""
        },
        tags: [
            {
                type: String,
                trim: true
            }
        ],
        socialLinks: {
            youtube: { type: String },
            twitter: { type: String },
            instagram: { type: String },
            facebook: { type: String }
        },
        privacy: {
            type: String,
            enum: ["public", "private"],
            default: "public"
        },
        subscribersCount: {
            type: Number,
            default: 0
        },
        totalViews: {
            type: Number,
            default: 0
        },
        totalVideos: {
            type: Number,
            default: 0
        },
        likesCount: {
            type: Number,
            default: 0
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

// Indexes to optimize search on name and tags
channelSchema.index({ name: "text", tags: "text" });

export const Channel = mongoose.model("Channel", channelSchema);
