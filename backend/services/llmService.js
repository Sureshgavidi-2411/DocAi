const generateAnswer = async (query, contextChunks) => {
  // 1. Construct the context string from the retrieved chunks
  const contextText = contextChunks
    .map((chunk, index) => `Chunk ${index + 1}:\n${chunk.content}`)
    .join("\n\n");

  // 2. Build the strict prompt for the LLM
  const prompt = `You are a helpful AI assistant. Answer the user's question based ONLY on the following context. If the answer is not in the context, say "I could not find that information in the uploaded document." Do not use outside knowledge. Keep your answer concise.

Context:
----------------
${contextText}
----------------

User Question: ${query}
Answer:`;

  try {
    // 3. Call local Ollama API (using Microsoft's Phi-3 model)
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "phi3",
        prompt: prompt,
        stream: false, // We want the full response at once for now
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to communicate with local LLM");
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error("LLM Generation Error:", error);
    throw new Error("Failed to generate AI answer. Make sure Ollama is running.");
  }
};

module.exports = {
  generateAnswer,
};