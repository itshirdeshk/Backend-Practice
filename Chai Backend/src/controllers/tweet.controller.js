import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    if (content === "") throw new ApiError(400, "Content can't be empty!");

    const tweet = await Tweet.create({
        user: req.user?._id,
        content,
    });

    req.status(200).json(new ApiResponse(200, tweet, "Tweet Created!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const username = await User.findById(req.user?._id);

    if (!username) throw new ApiError(400, "User should be logged In!");

    const tweets = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(username?.toLowerCase()),
            },
        },
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "tweets",
            },
        },
        {
            $project: {
                tweets: 1,
                fullName: 1,
                avatar: 1,
                username: 1,
            },
        },
    ]);

    if (!tweets) throw new ApiError(400, "No tweets found!");

    res.status(200).json(
        new ApiResponse(200, tweets, "Tweets found successfully")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;

    if (!tweetId) throw new ApiError(400, "Tweet not exist!");

    const { content } = req.body;

    if (content === "") throw new ApiError(400, "Tweet can't be empty!");

    const tweet = await Tweet.findByIdAndUpdate(
        { _id: tweetId },
        {
            $set: {
                content: content,
            },
        },
        {
            new: true,
        }
    );

    if (!tweet) throw new ApiError(500, "Tweet didn't update!!");

    res.status(200).json(
        new ApiResponse(200, tweet, "Tweet Updated Successfully!")
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;
    if (!tweetId) throw new ApiError(400, "Tweet id required!");

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    if (!deletedTweet) throw new ApiError(400, "Tweet not exist!");

    res.status(200).json(
        new ApiResponse(200, deletedTweet, "Tweet deleted successfully!")
    );
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
