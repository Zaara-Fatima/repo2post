import Session from "../models/Session.js"
import AppError from "../utils/AppError.js"

export const createSession= async (sessionData) => {
    const session = new Session({
        userId : sessionData.userId,
        refreshTokenHash: sessionData.refreshTokenHash,
        expiresAt: sessionData.expiresAt,
    })
    
    return session.save()
}

export const findByRefreshTokenHash = async (refreshTokenHash) => {
    const session = await Session.findOne({refreshTokenHash})
    if (!session) {
  throw new AppError("Session not found", 401);
}
    if(session.revokedAt){
        throw new AppError("Session is revoked", 401);
    }
    if(session.expiresAt <= new Date()){
        throw new AppError("Session expired", 401);
    }
    return session
}

export const revoke = async (id) => {
    const session = await Session.findById(id)
    if(!session){
        throw new AppError("Session Not Found", 404);
    }
    session.revokedAt = new Date()
    return session.save()
}