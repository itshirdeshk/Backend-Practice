import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination

    const queryConditions = query
        ? { title: { $regex: query, $options: "i" } }
        : {};

    if (userId) {
        queryConditions.owner = userId;
    }

    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;

    const skip = (pageNumber - 1) * pageSize;

    const videos = await Video.find(queryConditions)
        .sort({ [sortBy]: sortType === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(pageSize)
        .exec();

    if (!videos) throw new ApiError(400, "Video not found!");

    res.status(200).json(
        new ApiResponse(200, videos, "Videos found successfully!")
    );
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video

    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All Fields are required...");
    }

    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail is required!");
    }

    const videoFileLocalPath = req.files?.videoFile[0]?.path;

    if (!videoFileLocalPath) {
        throw new ApiError(400, "VideoFile is required!");
    }

    const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath);
    const videoUrl = await uploadOnCloudinary(videoFileLocalPath);

    if (!thumbnailUrl) {
        throw new ApiError(400, "Thumbnail is required!");
    }
    if (!videoUrl) {
        throw new ApiError(400, "VideoFile is required!");
    }

    const video = await Video.create({
        title,
        description,
        videoFile: videoUrl.url,
        thumbnail: thumbnailUrl.url,
        owner: req.user._id,
        duration: videoUrl.duration,
    });

    if (!video) {
        throw new ApiError(500, "An Internal Error Occurred!");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video Uploaded Successfully!"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(400, "Video not found!");
    }

    res.status(200).json(new ApiResponse(200, video, "Video Found!"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body;

    if ([title, description].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "Title and Description are required...");
    }

    const thumbnailLocalPath = req.file?.path;

    if (!thumbnailLocalPath) throw new ApiError(400, "Thumbnail is required!");

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail) throw new ApiError(400, "Thumbnail is required!");

    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                title,
                description,
                thumbnail: thumbnail.url,
            },
        },
        { new: true }
    );

    if (!video) throw new ApiError(500, "An Error Occurred while updating!");

    res.status(200).json(
        new ApiResponse(200, video, "Video details Updated Successfully!")
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video
    const result = await Video.deleteOne({ _id: videoId });

    if (result.ok == 0)
        throw new ApiError(
            500,
            "Some error occurred while deleting the video!"
        );

    res.status(200).json(
        new ApiResponse(200, {}, "Video deleted successfully!")
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    const video = await Video.findById(videoId);

    if (!video) throw new ApiError(400, "Video not found!");

    video.isPublished = !video.isPublished;
    const updatedVideo = await Video.updateOne(
        {
            _id: videoId,
        },
        {
            $set: {
                isPublished: video.isPublished,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedVideo)
        throw new ApiError(400, "Didn't toggle the published status!");

    res.status(200).json(
        new ApiResponse(200, updatedVideo, "Toggled Published Status!")
    );
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
