//create list //delete list //update list name

import { List } from "../models/List.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Task } from "../models/Task.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const createList = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(403, "you are not authenticated");
  }

  const { title } = req.body;

  if (!title || title.trim() === "") {
    throw new ApiError(400, "title is required");
  }

  const newList = await List.create({
    title,
    owner: req.user._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, newList, "list successfully created"));
});

const getAllLists = asyncHandler(async (req, res) => {
    if(!req.user){
        throw new ApiError(403,"you are not authorized")
    }
    
    const allLists = await List.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from: "tasks",
                localField: "_id",
                foreignField: "list",
                as: "tasks"
            }
        }
    ]);
    
    res.status(200).json(new ApiResponse(200, allLists, "lists fetched successfully"))
});


const deleteList = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(403, "you are not authorized");
  }

  const { listId } = req.params;
  if (!listId || !isValidObjectId(listId)) {
    throw new ApiError(400, "please enter a valid list Id");
  }

  const list = await List.findById(listId);

  if (!list) {
    throw new ApiError(404, "list doesnt exists");
  }

  if (list.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not the owner of the list");
  }

  await Task.deleteMany({
    list: new mongoose.Types.ObjectId(listId),
  });

  await List.deleteOne({
    _id: new mongoose.Types.ObjectId(listId)
  })

  res.status(200).json(new ApiResponse(200,{},"list deleted sucessfully"))
});

const updateList = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(403, "you are not authenticated");
  }

  const { listId } = req.params;
  const { title } = req.body;

  if (!listId || !isValidObjectId(listId)) {
    throw new ApiError(400, "please enter a valid list Id");
  }

  if (!title || title.trim() === "") {
    throw new ApiError(400, "title is required");
  }

  const list = await List.findById(listId);

  if (!list) {
    throw new ApiError(404, "list doesn't exist");
  }

  if (list.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not the owner of the list");
  }

  list.title = title;
  await list.save();

  res.status(200).json(new ApiResponse(200, list, "list updated successfully"));
});

export { createList, getAllLists, deleteList, updateList };
