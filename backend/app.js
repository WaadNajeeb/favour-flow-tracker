require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("./services/passport");
const authRoutes = require("./routes/auth-routes.js");
const favourRoutes = require("./routes/favour-routes.js");
const utilsRoutes = require("./routes/utils-routes.js");
const favourUserRoutes = require("./routes/user-favour-routes.js");
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// --- Determine environment ---
const isProduction = process.env.NODE_ENV === 'production';

// --- Middleware ---
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

// --- CORS ---
let allowedOrigins = ['http://localhost:4200']; // always allow localhost for dev
if (isProduction) {
  allowedOrigins.push('https://favour-flow-tracker.onrender.com');
  allowedOrigins.push('https://favour-flow-tracker.vercel.app');
} 

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow curl, mobile apps
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// --- API routes ---
app.use("/auth", authRoutes);
app.use("/favour", favourRoutes);
app.use("/utils", utilsRoutes);
app.use("/user-favour", favourUserRoutes);

// --- Serve Angular build in production ---
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../client/dist/client')));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/client/index.html'));
  });
}

// --- MongoDB connection ---
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
});
