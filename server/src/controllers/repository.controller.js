import { analyzeRepository, getRepoById, getRepoByUser } from "../services/repository.service.js"

export const repoController = async (req,res, next) => {
    try {
        const {url}= req.body
    if (!url) {
      return res.status(400).json({
        message: "GitHub repository URL is required",
      });
    }
    const repo =await analyzeRepository(url, req.user.sub)
    res.status(201).json({
        message: "REPO ANALYZE SUCCESSFULL. REPO SAVED",
        repo
    })
    } catch (error) {
        next(error)
    } 
}

export const getRepo = async (req,res,next) => {
    try {
        const user = req.user.sub
        const repo = await getRepoByUser(user)
        res.status(200).json({
            message: "REPO FOUND",
            repo
        })
    } catch (error) {
        next(error)
    }
}

export const getRepoByIdController = async (req,res,next)=>{
    try {
        const id = req.params.id
        const user = req.user.sub
        const repo = await getRepoById(id,user)
        res.status(200).json({
            message: "REPO FOUND",
            repo
        })
    } catch (error) {
        next(error)
    }
}