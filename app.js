const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const initializeAdmin = require("./config/initAdmin");

dotenv.config();
connectDB();

const app = express();

// ✅ Proper CORS configuration
const corsOptions = {
  origin: [
    "https://treazox1.vercel.app", // no trailing slash
    "http://localhost:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// Apply CORS middleware globally
app.use(cors(corsOptions));

// Use body parser
app.use(bodyParser.json());

// Routes
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoutes");
const planRoutes = require("./routes/planRoute");
const dashboardRoutes = require("./routes/dashboardRoute");
const balanceRoutes = require("./routes/balanceRoute");
const userPlanRoutes = require("./routes/userPlanRoute");
const investmentRoutes = require("./routes/investmentRoute");
const withdrawRoute = require("./routes/withdrawRoute");

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/balance", balanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/user-plans", userPlanRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/withdraw", withdrawRoute);

// Test route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Treazox Backend is running 🚀" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initializeAdmin();
});
