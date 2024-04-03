import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) throw new ApiError(400, "Video Id required!");

    const skip = (page - 1) * limit;

    const result = await Comment.find({ video: videoId })
        .skip(skip)
        .limit(limit);

    if (!result.length === 0)
        throw new ApiError(400, "There are no comments available!");

    res.status(200).json(new ApiResponse(200, result, "Comments Found!"));
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;

    if (!videoId) throw new ApiError(400, "Video Id required!");

    const { content } = req.body;

    if (content === "") throw new ApiError(400, "Content should not be empty!");

    const comment = await Comment.create({
        video: videoId,
        content,
        owner: req.user?._id,
    });

    res.status(200).json(new ApiResponse(200, comment, "Comment Added!"));
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;

    if (!commentId) throw new ApiError(400, "Comment not exist!");

    const { content } = req.body;

    if (content === "") throw new ApiError(400, "Comment can't be empty!");

    const comment = await Comment.findByIdAndUpdate(
        { _id: commentId },
        {
            $set: {
                content: content,
            },
        },
        {
            new: true,
        }
    );

    if (!comment) throw new ApiError(400, "Comment didn't update!");

    res.status(200).json(
        new ApiResponse(200, comment, "Comment Updated Successfully!")
    );
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if (!commentId) throw new ApiError(400, "Comment id required!");

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) throw new ApiError("Comment not exist!");

    res.status(200).json(
        new ApiResponse(200, deletedComment, "Comment deleted successfully!")
    );
});

export { getVideoComments, addComment, updateComment, deleteComment };
