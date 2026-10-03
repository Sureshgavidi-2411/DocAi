const express = require("express");
const cors = require("cors");

const documentRoutes = require("./routes/documentRoutes");

const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const searchRoutes = require("./routes/searchRoutes");
const app = express();


// Global middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/status", (req, res) => {
  res.json({
    message: "Enterprise AI Server is running securely!",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Document routes  ← PASTE HERE
app.use("/api/documents", documentRoutes);


app.use("/api/search", searchRoutes);

// Global error handler
app.use(errorHandler);

module.exports = app;