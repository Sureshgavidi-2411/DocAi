const {
  createDocument,
  processDocument,
  getUserDocuments,
} = require("../services/documentService");

const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a document",
      });
    }

    const document = await createDocument(req.user.id, req.file);

    const result = await processDocument(document._id);

    res.status(201).json({
      success: true,
      message: "Document uploaded and processed successfully",
      document: result.document,
      chunkCount: result.chunkCount,
      embeddingCount: result.embeddingCount,
    });
  } catch (error) {
    next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const documents = await getUserDocuments(req.user.id);

    res.status(200).json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
};