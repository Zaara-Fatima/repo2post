export const errorhandler = ( error, req, res, next)=>{
    console.log(error)

    const statusCode = error.statusCode || 500
    res.status(statusCode).json({
    status: "error",
    message: error.message || "Internal Server Error",
  });
}