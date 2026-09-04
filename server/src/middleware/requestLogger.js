export const requestLogger =(req,res,next)=>{
    console.log(`${Date.now()} ${req.method} ${req.originalUrl}`)
    next()}