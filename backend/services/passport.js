const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JwtStrategy } = require("passport-jwt");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("../models/user");
dotenv.config();

// 🔒 Extract token from cookie
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken']; // must match res.cookie() name
  }
  return token;
};

// 📧 Local strategy (email + password)
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Incorrect Username or Password." });

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) return done(err);
          if (isMatch) {
            return done(null, user, { success: true, message: "Logged in!" });
          } else {
            return done(null, false, {
              success: false,
              message: "Incorrect password entered!",
            });
          }
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// 🔐 JWT strategy (reads from cookie)
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id); // ✅ match token payload
        if (user) return done(null, user);
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

module.exports = passport;
