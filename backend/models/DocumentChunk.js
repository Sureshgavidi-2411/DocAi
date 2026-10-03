const mongoose = require("mongoose");

const documentChunkSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    embedding: {
    type: [Number],
    default: [],
    },

    startPosition: {
      type: Number,
      default: 0,
    },

    endPosition: {
      type: Number,
      default: 0,
    },
    
  },
  {
    timestamps: true,
  }
);

documentChunkSchema.index({
  document: 1,
  chunkIndex: 1,
});

const DocumentChunk = mongoose.model(
  "DocumentChunk",
  documentChunkSchema
);

module.exports = DocumentChunk;