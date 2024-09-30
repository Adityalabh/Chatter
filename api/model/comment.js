import mongoose from "mongoose";
const {Schema} = mongoose;

const commentSchema = new Schema({
    text:{
        type:String,
        require:true,
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    message:{
        type:Schema.Types.ObjectId,
        ref:"Message",
    }
});

const CommentModel = mongoose.model('Comment',commentSchema);

export const Comment = CommentModel;