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
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
