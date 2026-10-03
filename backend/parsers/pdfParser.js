const fs = require("fs");
const pdfParse = require("pdf-parse");

const extractPdfText = async (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);

  const pdfData = await pdfParse(fileBuffer);

  return pdfData.text;
};

module.exports = extractPdfText;