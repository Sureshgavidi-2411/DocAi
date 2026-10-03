const {
  searchSimilarChunks,
} = require("../services/vectorSearchService");

const {
  generateAnswer,
} = require("../services/llmService");

const searchDocuments = async (req, res, next) => {
  try {
    // 1. Get the user's original question
    const userQuery = req.body.query;

    // 2. Validate query
    if (!userQuery || userQuery.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    // 3. Perform vector search
    const results = await searchSimilarChunks(
      userQuery,
      5,
      req.user.id
    );

    // 4. Keep only sufficiently relevant chunks
    // 0.60 is the current similarity threshold
    const relevantResults = results.filter(
      (result) => result.score >= 0.60
    );

    // 5. If no relevant information is found
    if (relevantResults.length === 0) {
      return res.status(200).json({
        success: true,
        query: userQuery,
        answer:
          "I could not find that information in the uploaded document.",
        count: 0,
        sources: [],
      });
    }

    // 6. Send relevant chunks to the local LLM
    const answer = await generateAnswer(
      userQuery,
      relevantResults
    );

    // 7. Create unique sources
    const sourcesMap = new Map();

    relevantResults.forEach((result) => {
      const documentId = result.document.toString();

      if (!sourcesMap.has(documentId)) {
        sourcesMap.set(documentId, {
          documentName: result.documentName,
          chunks: [result.chunkIndex],
        });
      } else {
        sourcesMap.get(documentId).chunks.push(
          result.chunkIndex
        );
      }
    });

    // 8. Convert Map to array
    const sources = Array.from(sourcesMap.values());

    // 9. Sort chunk numbers
    sources.forEach((source) => {
      source.chunks.sort((a, b) => a - b);
    });

    // 10. Return final response
    res.status(200).json({
      success: true,
      query: userQuery,
      answer,
      count: relevantResults.length,
      sources,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchDocuments,
};