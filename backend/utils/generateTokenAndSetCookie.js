import jwt from 'jsonwebtoken';

export const generateTokenAndSetCookie = (res, userId) => {
  const Token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("AuthenticationToken", Token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
    sameSite: "strict", // Prevent CSRF attacks
  });

  return Token;
}
