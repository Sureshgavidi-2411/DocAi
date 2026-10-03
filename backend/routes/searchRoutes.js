const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
  searchDocuments,
} = require("../controllers/searchController");

const router = express.Router();

router.post("/", protect, searchDocuments);

module.exports = router;