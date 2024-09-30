import mongoose from 'mongoose';
const {Schema} = mongoose;

const messageSchema = new Schema({
    description:{
        type:String,

    },
    like:{
        type:Array,
        default:[],
    },
   
    senderId:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    postImage:{
        type:String,
        default:"",
    },
    comments:[{
        type:Schema.Types.ObjectId,
        ref:"Comment",
    }]
    
},{timestamps:true});

const MessageModel = mongoose.model("Message",messageSchema);
export const Message = MessageModel;