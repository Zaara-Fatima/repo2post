import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    passwordHash:{
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum:["user", "admin"],
        default: "user"
    }
},{
    timestamps: true
})

const User = mongoose.model("User", userSchema)

export default User
