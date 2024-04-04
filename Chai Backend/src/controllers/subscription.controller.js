import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // TODO: toggle subscription
    if (!channelId) throw new ApiError(400, "Channel Id required!");

    const existingSubs = await Subscription.findOne({ channel: channelId });

    let result;

    if (existingSubs) {
        result = await Subscription.deleteOne({ channel: existingSubs._id });
    } else {
        const newSubs = new Subscription({
            subscriber: req.user?._id,
            channel: channelId,
        });
        result = await newSubs.save();
    }

    if (!result) throw new ApiError(400, "Can't toggled the subscription!");

    res.status(200).json(new ApiResponse(200, result, "Toggled Subscription!"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId) throw new ApiError(400, "Channel ID required!");

    const subscribers = Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channelId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscribers",
            },
        },
        {
            $unwind: "$subscribers",
        },
        {
            $project: {
                _id: "$subscribers._id",
                username: "$subscribers.username",
                avatar: "$subscribers.avatar",
            },
        },
    ]);

    if (!subscribers) throw new ApiError(400, "Subscribers not found!");

    res.status(200).json(
        new ApiResponse(200, subscribers, "Subscribers fetched successfully!")
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!subscriberId) throw new ApiError(400, "Subscriber ID required!");

    const channels = Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(subscriberId),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channels",
            },
        },
        {
            $unwind: "$channels",
        },
        {
            $project: {
                _id: "$channels._id",
                username: "$channels.username",
                avatar: "$channels.avatar",
            },
        },
    ]);

    if (!channels) throw new ApiError(400, "Channels not found!");

    res.status(200).json(
        new ApiResponse(200, channels, "Channels fetched successfully!")
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
