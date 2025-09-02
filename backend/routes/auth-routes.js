const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');
const RefreshToken = require('../models/refreshToken');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const jdenticon = require('jdenticon');


router.post("/allUsers", async (req, res) => {
  try {
    const users = await User.find({}, '_id'); // Only fetch _id field
    const userIds = users.map(user => user._id); // Format as ObjectId strings

    res.status(200).json(userIds);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// REGISTER
router.post("/register", async (req, res) => {
  const { firstName, lastName, password, confirmPassword, email } = req.body;

  if (!firstName || firstName.length < 2) {
    return res.status(400).json({ success: false, message: "Enter First Name" });
  }
  if (!lastName || lastName.length < 2) {
    return res.status(400).json({ success: false, message: "Enter Last Name" });
  }

  if (!email || !/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }

  if (!password || password.length < 8 || password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Password must match and be at least 8 characters" });
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const initials = `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase();
  const size = 100;
  const svg = jdenticon.toSvg(initials, size);
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

  try {
    // Saving new user in DB
    const newUser = new User();
    newUser.firstName = firstName;
    newUser.lastName = lastName;
    newUser.email = email.toLowerCase();
    newUser.avatar = dataUrl;
    newUser.password = newUser.hashPassword(password);

    const savedUser = await newUser.save();

    return res.send({
      success: true,
      message: "Account created!",
    });
  } catch (err) {
    return res.send({
      success: false,
      message: "Server error",
    });
  }

});

router.post("/login", (req, res, next) => {
  passport.authenticate('local', { session: false }, async (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ success: false, message: info?.message });

    const rememberMe = req.body.rememberMe === true;

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days in DB

    // Store refresh token in DB (regardless of rememberMe)
    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + refreshTokenExpiry)
    });

    // Set access token cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      ...(rememberMe ? { maxAge: 15 * 60 * 1000 } : {}) // 15 mins or session cookie
    });

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      ...(rememberMe ? { maxAge: refreshTokenExpiry } : {}) // 7 days or session cookie
    });

    res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
      }
    });

  })(req, res, next);
});

// GET NEW ACCESS TOKEN
router.get('/token', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(400).json({ success: false, message: 'No refresh token' });
  }

  const storedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken({ _id: decoded.id }); // Consistent payload

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000,
    });

    res.json({ success: true, message: 'New access token generated' });
  } catch (err) {
    res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
});
// GET CURRENT USER
router.get('/current_user', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    const user = await User.findById(req.user._id).select('-password -__v');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
// CHECK AUTH
router.get('/isAuthenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json(true);
});

// CHECK SIGN-IN
router.get('/isSigned', (req, res) => {
  const accessToken = req.cookies?.accessToken;
  res.json(!!accessToken);
});

// LOGOUT
router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await RefreshToken.deleteOne({ token: refreshToken });
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: "Logged out successfully" });
});

router.post('/fix-usernames', async (req, res) => {
  try {
    const users = await User.find();

    for (const user of users) {
      if (user.email) {
        const newUserName = user.email.split('@')[0];

        // Only update if username is missing or different
        if (!user.userName || user.userName !== newUserName) {
          user.userName = newUserName;
          await user.save();
        }
      }
    }

    res.json({ success: true, message: 'Usernames updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;