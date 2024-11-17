// import { Channel } from '../models/channel.model';


// // Middleware to check if the user has a channel
// const checkChannel = async (req, res, next) => {
//     try {
//         // Find the channel associated with the current user
//         const channel = await Channel.findOne({ user: req.user._id });

//         if (!channel) {
//             // If no channel is found, send a message that the user needs to create a channel first
//             return res.status(400).json({ message: 'You must create a channel before performing this action.' });
//         }

//         // If channel exists, pass control to the next middleware/route handler
//         next();
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Something went wrong while checking the channel.' });
//     }
// };

// module.exports = checkChannel;





// // ===  Routes  === // 

// const express = require('express');
// const router = express.Router();
// const multer = require('multer');
// const path = require('path');

// // Import the models
// const Video = require('../models/Video');
// const checkChannel = require('../middleware/checkChannel');  // Import the checkChannel middleware

// // File upload settings with multer
// const upload = multer({
//     dest: 'uploads/videos/',
//     limits: { fileSize: 100 * 1024 * 1024 },  // Max 100MB per file
//     fileFilter: (req, file, cb) => {
//         const ext = path.extname(file.originalname);
//         if (ext !== '.mp4' && ext !== '.mov' && ext !== '.avi') {
//             return cb(new Error('Only video files are allowed.'));
//         }
//         cb(null, true);
//     }
// });

// // Upload video route protected by the checkChannel middleware
// router.post('/upload', checkChannel, upload.single('video'), async (req, res) => {
//     try {
//         const newVideo = new Video({
//             title: req.body.title,
//             file: req.file.path,  // Path to the uploaded video file
//             user: req.user._id,  // User ID from the authenticated user
//             channel: req.user.channel._id  // Assuming you store the user's channel reference here
//         });

//         await newVideo.save();
//         res.status(200).json({ message: 'Video uploaded successfully!', video: newVideo });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Something went wrong while uploading the video.' });
//     }
// });

// module.exports = router;


