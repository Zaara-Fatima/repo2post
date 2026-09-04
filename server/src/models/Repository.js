import mongoose from "mongoose";

const repoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default:"",
    trim: true
  },
  stars: {
    type: Number,
    default: 0
  },
  topics: {
    type: [String],
    default:[]
  },
  languages: {
    type: Object,
  },
  readme: {
    type: String,
  },
  files: {
    type: [String],
    default: []
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
},{
    timestamps: true

});

repoSchema.index({userId: 1, owner: 1, name: 1
}, {unique: true})

const Repository = mongoose.model("Repository", repoSchema)
export default Repository