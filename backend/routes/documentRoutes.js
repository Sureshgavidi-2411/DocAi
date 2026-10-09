const express = require("express");

const {
  uploadDocument,
  getDocuments,
  removeDocument,
} = require("../controllers/documentController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Upload a document
router.post(
  "/upload",
  protect,
  upload.single("document"),
  uploadDocument
);

// Get logged-in user's documents
router.get(
  "/",
  protect,
  getDocuments
);

// Delete logged-in user's document
router.delete(
  "/:id",
  protect,
  removeDocument
);

module.exports = router;