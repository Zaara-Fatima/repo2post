import Post from "../models/Post.js"

export const createPost = async(postData)=>{
    const post = new Post({
        userId: postData.userId,
        repositoryId: postData.repositoryId,
        hook: postData.hook,
        content: postData.content,
        hashtags: postData.hashtags,
        cta: postData.cta
    })
    return post.save()
}