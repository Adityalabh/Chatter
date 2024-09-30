import mongoose from 'mongoose';

const {Schema} = mongoose;

const conversationSchema = new Schema({
    participant:[{
        type:Schema.Types.ObjectId,
        ref:"User",
    }],
    messages:[{
        type:Schema.Types.ObjectId,
        ref:"Chat",
    }], 
});

const ConversationModel = mongoose.model("Conversation",conversationSchema);

export const Conversation = ConversationModel;