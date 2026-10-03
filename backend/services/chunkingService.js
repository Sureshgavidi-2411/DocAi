const DocumentChunk = require("../models/DocumentChunk");

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

const splitTextIntoChunks = (text) => {
  if (!text || !text.trim()) {
    return [];
  }

  const chunks = [];

  let start = 0;
  let chunkIndex = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);

    const chunk = text.slice(start, end).trim();

    if (chunk) {
      chunks.push({
        chunkIndex,
        content: chunk,
        startPosition: start,
        endPosition: end,
      });

      chunkIndex++;
    }

    if (end >= text.length) {
      break;
    }

    start = end - CHUNK_OVERLAP;
  }

  return chunks;
};

const createDocumentChunks = async (document) => {
  const chunks = splitTextIntoChunks(document.extractedText);

  if (chunks.length === 0) {
    throw new Error("No text available for chunking");
  }

  await DocumentChunk.deleteMany({
    document: document._id,
  });

  const documentsToInsert = chunks.map((chunk) => ({
    document: document._id,
    user: document.user,
    chunkIndex: chunk.chunkIndex,
    content: chunk.content,
    startPosition: chunk.startPosition,
    endPosition: chunk.endPosition,
  }));

  const savedChunks = await DocumentChunk.insertMany(
    documentsToInsert
  );

  return savedChunks;
};

module.exports = {
  splitTextIntoChunks,
  createDocumentChunks,
};