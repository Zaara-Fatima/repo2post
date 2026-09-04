class AppError extends Error {
    constructor(message, statusCode) {
       super(message)
       
       this.statusCode = statusCode,
       this.status = "error"
    }
}

export default AppError