import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    mobile: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    roles:{
        type:String,
        enum:['admin','user'],
        default:'user'
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);

export default User
