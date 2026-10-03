const mongoose = require("mongoose");

const DocumentChunk = require("../models/DocumentChunk");

const { generateEmbedding } = require("./embeddingService");

const searchSimilarChunks = async (
  query,
  limit = 5,
  userId
) => {
  const queryEmbedding = await generateEmbedding(query);

  const userObjectId = new mongoose.Types.ObjectId(userId);

  const results = await DocumentChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 50,
        limit,

        filter: {
          user: {
            $eq: userObjectId,
          },
        },
      },
    },

    {
      $lookup: {
        from: "documents",
        localField: "document",
        foreignField: "_id",
        as: "documentInfo",
      },
    },

    {
      $unwind: "$documentInfo",
    },

    {
      $project: {
        _id: 1,
        document: 1,
        documentName: "$documentInfo.originalName",
        chunkIndex: 1,
        content: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  return results;
};

module.exports = {
  searchSimilarChunks,
};