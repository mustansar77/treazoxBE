const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const initializeAdmin = require("./config/initAdmin"); // import the module

dotenv.config();
connectDB();

const app = express();
// ✅ Enhanced CORS Configuration
const corsOptions = {
  origin:['https://treazox1.vercel.app/',"http://localhost:3000"]
};
app.use(cors(corsOptions));
app.use(bodyParser.json());


// Routes
const userRoutes = require("./routes/userRoute");
const adminRoutes = require("./routes/adminRoutes");

const planRoutes=require("./routes/planRoute")
const dashboardRoutes = require("./routes/dashboardRoute");
const balanceRoutes = require("./routes/balanceRoute");
const userPlanRoutes= require("./routes/userPlanRoute")
const investmentRoutes= require("./routes/investmentRoute")
const withdrawRoute= require("./routes/withdrawRoute")



app.use("/api/dashboard", dashboardRoutes);
// admin balance management
app.use("/api/balance", balanceRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin",adminRoutes );

app.use("/api/plans", planRoutes);
app.use("/api/user-plans",userPlanRoutes);
app.use("/api/investments",investmentRoutes);
app.use("/api/withdraw",withdrawRoute);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // Initialize admin on server start
  await initializeAdmin();
});




// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzliZGY1NDc3OGI4ZDU3YmEwYzdmYiIsImlhdCI6MTc2NTM5NTEyNCwiZXhwIjoxNzY1OTk5OTI0fQ.u7P-Jcrnud8JeRxM9LzQqTxka9qUP2yaqrs7XOA_yDs