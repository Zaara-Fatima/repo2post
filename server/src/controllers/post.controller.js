
import { generatePost } from "../services/post.service.js"

export const generatePostController = async (req, res, next) => {
    try {
     const repositoryId = req.body.repositoryId
    const post = await generatePost(repositoryId, req.user.sub)
    res.status(201).json({
        status: "success",
        message: "POST CREATED",
        post
    })
    } catch (error) {
        next(error)
    }
}