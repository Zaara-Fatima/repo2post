import jwt from "jsonwebtoken"
import AppError from "../utils/AppError.js"
export const protect = (req,res,next) => {
    try {
        const authHeader = req.headers.authorization

        if(!authHeader){
            throw new AppError("AUTHENTICATION REQUIRED", 401)
        }

        const [schema, token] = authHeader.split(" ")
        if(schema !== "Bearer" || !token){
            throw new AppError("Invalid authorization header", 401);
        }

        const decoded = jwt.verify(token, process.env.ACCESS_SECRET)

        req.user = decoded
        next()
    } catch (error) {
        if (error instanceof AppError) {
        return next(error)
    }

    return next(new AppError("Invalid or expired token", 401))
    }
    
}


