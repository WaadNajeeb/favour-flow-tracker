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
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error('Not allowed by CORS'), false); // Reject with error
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow common headers
  optionsSuccessStatus: 200 // Respond 200 to preflight requests
}));

// --- API routes ---
app.use("/auth", authRoutes);
app.use("/favour", favourRoutes);
app.use("/utils", utilsRoutes);
app.use("/user-favour", favourUserRoutes);

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