import { findById } from "../repositories/user.repository.js";

export const getMe = async (req, res, next) => {
  try {
    const user = await findById(req.user.sub);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error)
  }
};
