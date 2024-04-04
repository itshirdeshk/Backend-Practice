import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const channelId = req.user?._id;
    if (!channelId) throw new ApiError(400, "User should be logged In!");

    const videos = await Video.find({ owner: channelId });

    if (!videos) throw new ApiError(400, "No videos found");

    let totalVideos, totalViews;

    if (videos.length > 0) {
        totalVideos = videos.length;

        totalViews = videos.reduce((acc, video) => acc + video.views, 0);
    }

    const subscribers = await Subscription.find({ channel: channelId });

    if (!subscribers) throw new ApiError(400, "No subscribers found");

    const totalSubs = subscribers.length;

    const likes = await Like.aggregate([
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videoInfo",
            },
        },
        {
            $match: {
                "videoInfo.owner": channelId,
            },
        },
        {
            $count: "totalLikes",
        },
    ]);

    const totalLikes = likes.length > 0 ? likes[0].totalLikes : 0;

    const result = {
        totalVideos: totalVideos,
        totalViews: totalViews,
        totalSubs: totalSubs,
        totalLikes: totalLikes,
    };

    res.status(200).json(
        new ApiResponse(200, result, "Channel stats fetched successfully!")
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId = req.user?._id;

    if (!userId) throw new ApiError(400, "User should be logged In!");

    const videos = await Video.find({ owner: userId });

    if (!videos) throw new ApiError(400, "No videos available!");

    res.status(200).json(
        new ApiResponse(200, videos, "Videos fetched successfully!")
    );
});

export { getChannelStats, getChannelVideos };
