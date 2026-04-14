const path = require("node:path");
const fs = require("node:fs/promises");

/**
 * Parses a string into a text array.
 * @param {string} str
 * @param {string} delimiter
 */
function parseString(str, delimiter = "\n") {
  return str
    .split(delimiter)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Parses a buffer into a text array.
 * @param {Buffer} buffer
 * @param {string} delimiter
 * @param {BufferEncoding} encoding
 */
function parseBuffer(buffer, delimiter = "\n", encoding = "utf8") {
  const bufferContent = buffer.toString(encoding);
  return parseString(bufferContent, delimiter);
}

/**
 * Parses a text file into a text array.
 * @param {string} filePath
 * @param {string} delimiter
 * @param {BufferEncoding} encoding
 */
async function parseFile(filePath, delimiter = "\n", encoding = "utf8") {
  const file = path.resolve(process.cwd(), filePath);
  const buffer = await fs.readFile(file);
  return parseBuffer(buffer, delimiter, encoding);
}

module.exports = {
  parseString,
  parseBuffer,
  parseFile,
};
