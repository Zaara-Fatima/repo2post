import jwt from "jsonwebtoken";
import crypto from "crypto"
export const generateAccessToken = (user) => {
  const token = jwt.sign({ sub: user._id.toString(), role: user.role },process.env.ACCESS_SECRET, {
    expiresIn: "15m"
  });
  return token
};

export const generateRefreshToken = ()=>{
  return crypto.randomBytes(64).toString("hex")
}