import mongoose from 'mongoose';
const { Schema } = mongoose;

const chatSchema = new Schema({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
        required: true,
    },
});
const ChatModel = mongoose.model("Chat", chatSchema);
export const Chat = ChatModel;