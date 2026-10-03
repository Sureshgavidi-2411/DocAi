const { pipeline } = require("@huggingface/transformers");
const DocumentChunk = require("../models/DocumentChunk");

const MODEL_NAME = "Xenova/all-MiniLM-L6-v2";

let extractor = null;

const getExtractor = async () => {
  if (!extractor) {
    console.log("Loading local embedding model...");

    extractor = await pipeline("feature-extraction", MODEL_NAME);

    console.log("Local embedding model loaded successfully.");
  }

  return extractor;
};

const generateEmbedding = async (text) => {
  const model = await getExtractor();

  const output = await model(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
};

const generateDocumentEmbeddings = async (documentId) => {
  const chunks = await DocumentChunk.find({
    document: documentId,
  }).sort({ chunkIndex: 1 });

  if (chunks.length === 0) {
    throw new Error("No chunks found for this document");
  }

  let processedCount = 0;

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.content);

    chunk.embedding = embedding;

    await chunk.save();

    processedCount++;

    console.log(
      `Embedding generated: ${processedCount}/${chunks.length}`
    );
  }

  return processedCount;
};

module.exports = {
  generateEmbedding,
  generateDocumentEmbeddings,
};