const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const initializeAdmin = require("./config/initAdmin");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS Config
const corsOptions = {
  origin: ['https://treazox1.vercel.app', "http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};
app.use(cors(corsOptions));

// ✅ Parse JSON body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const userRoutes = require("./routes/userRoute");
app.use("/api/users", userRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "Treazox Backend is running 🚀",
  });
});

// Catch-all for unsupported methods on API routes
app.all("/api/", (req, res, next) => {
  if (req.method !== "POST" && req.method !== "GET" && req.method !== "PUT" && req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  next();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeAdmin();
});
