const jwt = require('jsonwebtoken');
const Avatar = require('avatar-initials');

function generateAccessToken(user) {
  return jwt.sign(
    { id: user._id }, // match passport expectation
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
}

module.exports = {
  generateAccessToken,
  generateRefreshToken
};