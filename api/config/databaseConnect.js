import  mongoose from 'mongoose';
import  dotenv from 'dotenv';

dotenv.config({
    path:"../.env"
}
);

function databaseConnect() {
    mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('database connected');
    }).catch((err) => {
        console.log(err);
    })
}
export default databaseConnect;