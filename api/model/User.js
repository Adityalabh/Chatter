import mongoose from 'mongoose';
const {Schema} = mongoose;

const userSchema = new Schema({
    userName :{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    followers:{
        type:Array,
        default:[],
    },
    description:{
        type:String,
        default:null,
    },
    following:{
        type:Array,
        default:[],
    },
    bookmark:{
        type:Array,
        default:[],
    },
    bannerImage:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    profileImage:{
        type:String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg",
    },
},{timestamps:true});

const UserModel = mongoose.model('User',userSchema);
export const User = UserModel;