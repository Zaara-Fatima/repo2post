import AppError from "./AppError.js";

export const handleAIError =(error)=>{
    if (error.response){
        const status = error.response.status;
        if (status === 401 || status === 403) {
            throw new AppError(
                "AI service authentication failed",
                502
            );
        }

        if (status === 429) {
            throw new AppError(
                "AI service rate limit exceeded",
                429
            );
        }
         if (status >= 500) {
            throw new AppError(
                "AI service is temporarily unavailable",
                503
            );
        }
    }
}