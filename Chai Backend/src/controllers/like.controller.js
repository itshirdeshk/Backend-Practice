import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video
    const userId = req.user?._id;

    if (!videoId) throw new ApiError(400, "Video Id required!");
    if (!userId) throw new ApiError(400, "User should be logged In!");

    // Check if the user has already liked the video
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: userId,
    });

    let result;

    if (existingLike) {
        // User has already liked the video, so remove the like
        result = await Like.deleteOne({ _id: existingLike._id });
    } else {
        // User has not liked the video, so add a like
        const newLike = new Like({ video: videoId, likedBy: userId });
        result = await newLike.save();
    }

    res.status(200).json(new ApiResponse(200, result, "Toggled Video Like!"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment
    const userId = req.user?._id;

    if (!commentId) throw new ApiError(400, "Video Id required!");
    if (!userId) throw new ApiError(400, "User should be logged In!");

    // Check if the user has already liked the video
    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: userId,
    });

    let result;

    if (existingLike) {
        // User has already liked the video, so remove the like
        result = await Like.deleteOne({ _id: existingLike._id });
    } else {
        // User has not liked the video, so add a like
        const newLike = new Like({ video: videoId, likedBy: userId });
        result = await newLike.save();
    }

    res.status(200).json(new ApiResponse(200, result, "Toggled Video Like!"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet
    const userId = req.user?._id;

    if (!tweetId) throw new ApiError(400, "Video Id required!");
    if (!userId) throw new ApiError(400, "User should be logged In!");

    // Check if the user has already liked the video
    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId,
    });

    let result;

    if (existingLike) {
        // User has already liked the video, so remove the like
        result = await Like.deleteOne({ _id: existingLike._id });
    } else {
        // User has not liked the video, so add a like
        const newLike = new Like({ video: videoId, likedBy: userId });
        result = await newLike.save();
    }

    res.status(200).json(new ApiResponse(200, result, "Toggled Video Like!"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const user = req.user?._id;

    const likedVideos = await Like.find({ likedBy: user })
        .populate("video")
        .exec();

    if (!likedVideos || likedVideos.length === 0)
        throw new ApiError(400, "There are no liked videos!");

    res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked Videos fetched successfully!")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
