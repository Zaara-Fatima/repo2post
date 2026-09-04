import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    refreshTokenHash:{
        type: String, 
        required: true,
        index: true,
        unique: true
    },
    expiresAt:{
        type: Date,
        required: true
    },
    revoked:{
        type: Date,
        default : null
    }
},{
    timestamps:true
})

const Session = mongoose.model("Session", sessionSchema)

export default Session