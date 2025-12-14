const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const initializeAdmin = async () => {
  try {
    const adminEmail = "admin@example.com"; // change as needed
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("Admin already exists");
      return; // just return, don't exit process
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      fullName: "Admin User",
      email: adminEmail,
      phone: "+920000000000",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin user created successfully:", admin.email);
  } catch (err) {
    console.error("Error initializing admin:", err);
  }
};

module.exports = initializeAdmin;




//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzliZGY1NDc3OGI4ZDU3YmEwYzdmYiIsImlhdCI6MTc2NTM5Mjc4MywiZXhwIjoxNzY1OTk3NTgzfQ.hs75RWhvqr_ktPgNsADUnG9Nzt6XTetQiNepOq4_ivM 
