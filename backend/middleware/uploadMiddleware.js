const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = [".pdf", ".docx", ".doc", ".txt"];
  const allowedTypes = [
    "application/pdf",
    "application/x-pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  const isExtAllowed = allowedExtensions.includes(ext);
  const isMimeAllowed = allowedTypes.includes(file.mimetype);

  if (isExtAllowed || isMimeAllowed) {
    cb(null, true);
  } else {
    const error = new Error("Only PDF, DOCX, and TXT files are allowed");
    error.statusCode = 400;
    cb(error);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;