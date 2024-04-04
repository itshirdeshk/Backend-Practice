import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    //TODO: create playlist
    if (name === "" || description === "")
        throw new ApiError(400, "Name and description required!");

    const playlist = await Playlist.create({
        name,
        description,
        user: req.user?._id,
    });

    if (!playlist) throw new ApiError(500, "Playlist didn't created!");

    res.status(200).json(
        new ApiResponse(200, playlist, "PLaylist created successfully!")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists
    if (!userId) throw new ApiError(400, "User Id required!");

    const playlists = await Playlist.find({ owner: userId });

    if (!playlists) throw new ApiError(400, "Playlist not found!");

    res.status(200).json(
        new ApiResponse(200, playlists, "User Playlists fetched!")
    );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id

    if (!playlistId) throw new ApiError(400, "Playlist Id required!");

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) throw new ApiError(400, "Playlist doesn't exist!");

    res.status(200).json(
        new ApiResponse(200, playlist, "Playlist feteched successfully!")
    );
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    if (!playlistId) throw new ApiError(400, "Playlist Id required!");
    if (!videoId) throw new ApiError(400, "Video Id required!");

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) throw new ApiError(400, "PLaylist not found!");

    playlist.videos.push(videoId);
    await playlist.save();

    res.status(200).json(new ApiResponse(200, {}, "Video added successfully!"));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist
    if (!playlistId) throw new ApiError(400, "Playlist Id required!");
    if (!videoId) throw new ApiError(400, "Video Id required!");

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: {
                videos: videoId,
            },
        },
        {
            new: true,
        }
    );

    if (!updatedPlaylist) throw new ApiError(400, "Video didn't deleted!");

    res.status(200).json(
        new ApiResponse(200, updatedPlaylist, "Video removed successfully!")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist
    if (!playlistId) throw new ApiError(400, "Playlist Id required!");

    const result = await Playlist.findByIdAndDelete(playlistId);

    if (!result || result.ok === 0)
        throw new ApiError(500, "Playlist didn't deleted!");

    res.status(200).json(200, result, "Playlist deleted successfully!");
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist
    if (!playlistId) throw new ApiError(400, "Playlist Id required!");

    if (name === "" || description === "")
        throw new ApiError(400, "Name and Description can't be empty!");

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: {
                name,
                description,
            },
        },
        { new: true }
    );

    if (!playlist)
        throw new ApiError(400, "Playlist didn't deleted successfully!");

    res.status(200).json(200, playlist, "Playlist Updated!");
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
