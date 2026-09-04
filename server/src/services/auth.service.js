import bcrypt from "bcryptjs";

import {
  create,
  findByEmail,
  findById
} from "../repositories/user.repository.js";
import { createSession, findByRefreshTokenHash, revoke } from "../repositories/session.repository.js";
import AppError from "../utils/AppError.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import hashToken from "../utils/hashToken.js";

export const register = async (userData) => {
  const existingUser = await findByEmail(userData.email);

  if (existingUser) {
    throw new AppError("Email already registered", 409);
  }

  const passwordHash = await bcrypt.hash(
    userData.password,
    12
  );

  const user = await create({
    name: userData.name,
    email: userData.email,
    passwordHash,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const login = async (userData) => {
  const user = await findByEmail(userData.email)
  if(!user){
    throw new AppError("Invalid email or password", 401)
  }
  const comparePass = await bcrypt.compare(userData.password, user.passwordHash)
  if(!comparePass){
    throw new AppError(" Invalid email or password", 401)
  }
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken()
  const refreshTokenHash= hashToken(refreshToken)
  const expiresAt = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000
);
  const session =await createSession({
    userId: user._id,
    refreshTokenHash: refreshTokenHash,
    expiresAt: expiresAt
  })

  return {
    accessToken,
    refreshToken,
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}


export const refresh = async (refreshToken) => {
  const hashedToken = hashToken(refreshToken)
  const session =await findByRefreshTokenHash(hashedToken)
  if(!session){
    throw new AppError("Sessiion not found", 401)
  }
    await revoke(session._id)
    const user = await findById(session.userId);
    const accessToken = generateAccessToken(user)
    const newRefreshToken = generateRefreshToken()
    const newRefreshTokenHash = hashToken(newRefreshToken)
    const expiresAt = new Date(
  Date.now() + 7 * 24 * 60 * 60 * 1000
);
    const newSession = await createSession({
      userId: session.userId,
      refreshTokenHash: newRefreshTokenHash,
      expiresAt: expiresAt
    })
    return {
    accessToken,
    refreshToken: newRefreshToken,
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  }
}

export const logout =async (refreshToken) => {
  if (!refreshToken) {
    return;
  }
  const hashedToken = hashToken(refreshToken)
  
  try {
    const session = await findByRefreshTokenHash(hashedToken)
    if(!session){
    return
  }
  await revoke(session._id)
  } catch (error) {
    return 
  }
}