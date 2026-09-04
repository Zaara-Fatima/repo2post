import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    userId :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true
    },
    repositoryId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository",
        required: true
    },
    hook:{
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    hashtags:{
        type: [String],
        required: true
    },
    cta:{
        type: String,
        required: true
    }
},{
    timestamps: true
})

const Post = mongoose.model("Post", postSchema)
export default Post