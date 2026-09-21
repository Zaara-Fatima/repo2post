export const requestLogger =(req,res,next)=>{
    
    const start =  Date.now()
    next()
    res.on("finish",()=>{
        const duration = Date.now() -start
        console.log(`${duration} ${req.method} ${req.originalUrl} ${res.statusCode}`)
    })
    
}