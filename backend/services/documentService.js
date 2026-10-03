const path = require("path");
const fs = require("fs");
const Document = require("../models/Document");
const extractPdfText = require("../parsers/pdfParser");

const { createDocumentChunks } = require("./chunkingService");

const {
  generateDocumentEmbeddings,
} = require("./embeddingService");

const createDocument = async (userId, file) => {
  const document = await Document.create({
    user: userId,
    originalName: file.originalname,
    fileName: file.filename,
    filePath: file.path,
    mimeType: file.mimetype,
    fileSize: file.size,
    status: "UPLOADED",
  });

  return document;
};

const processDocument = async (documentId) => {
  const document = await Document.findById(documentId);

  if (!document) {
    throw new Error("Document not found");
  }

  try {
    document.status = "PROCESSING";
    await document.save();

    let extractedText = "";
    const ext = path.extname(document.originalName || document.filePath || "").toLowerCase();
    const isPdf = ext === ".pdf" || (document.mimeType && document.mimeType.includes("pdf"));
    const isTxt = ext === ".txt" || document.mimeType === "text/plain";

    if (isPdf) {
      extractedText = await extractPdfText(document.filePath);
    } else if (isTxt) {
      extractedText = fs.readFileSync(document.filePath, "utf-8");
    } else {
      throw new Error("Unsupported document type for text extraction");
    }

    if (!extractedText || !extractedText.trim()) {
      throw new Error("No text could be extracted from the document");
    }

    document.extractedText = extractedText;
    await document.save();

    const chunks = await createDocumentChunks(document);

    const embeddingCount = await generateDocumentEmbeddings(
    document._id
    );

    document.status = "COMPLETED";
    await document.save();

    return {
      document,
      chunkCount: chunks.length,
    };
  } catch (error) {
    document.status = "FAILED";
    await document.save();

    throw error;
  }
};

const getUserDocuments = async (userId) => {
  return Document.find({ user: userId })
    .sort({ createdAt: -1 });
};

module.exports = {
  createDocument,
  processDocument,
  getUserDocuments,
};