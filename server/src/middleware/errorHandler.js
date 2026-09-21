import { ZodError } from "zod";

export const errorhandler = ( error, req, res, next)=>{
    console.log(error)
    if (error instanceof ZodError) {
    // handle validation error
     return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: error.issues
    })
}

    const statusCode = error.statusCode || 500
    res.status(statusCode).json({
    status: "error",
    message: error.message || "Internal Server Error",
  });
}