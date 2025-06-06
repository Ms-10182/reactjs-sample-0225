import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    content:{
        type:String,
        required: true,
        trim: true
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    list:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"List",
        required: true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    }
},{timestamps:true})

export const Task = mongoose.model("Task",taskSchema)