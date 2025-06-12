const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authenticateToken = require("./middlewares/authMiddleware.js");
const contactRoutes = require("./routes/contactRoutes.js");
const careerRoutes = require('./routes/careerRoutes.js');
const blogRoutes = require("./routes/blogRoutes.js");
const authRoutes = require("./routes/authRoutes.js"); // Correctly import authRoutes

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*", // Allow both ports
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/contacts", contactRoutes);
app.use('/api/careers', careerRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/auth", authRoutes); // Use the correct route path

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
