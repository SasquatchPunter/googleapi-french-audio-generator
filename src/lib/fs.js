const slugify = require("slugify");
const { AUDIO_ENCODING } = require("./config.js");
const fs = require("node:fs/promises");

/**
 * Sanitizes a filename.
 * @param {string} filename
 */
function sanitizeFilename(filename) {
  return slugify(filename, { strict: true, lower: true });
}

/**
 * Gets file suffix based on `AUDIO_ENCODING`
 * @param {typeof AUDIO_ENCODING[keyof typeof AUDIO_ENCODING]} encoding
 */
function getSuffix(encoding) {
  switch (encoding) {
    case "MP3":
      return "mp3";
    case "LINEAR16":
      return "wav";
    case "M4A":
      return "m4a";
  }
}

/** Digit length of the index prefix */
const indexLength = 3;
/** Regex of the index prefix */
const indexRegex = new RegExp(`^\\d{${indexLength}}-`);

/**
 * Removes the index prefix from the filename
 * @param {string} fileName
 */
function removeIndex(fileName) {
  return fileName.replace(indexRegex, "");
}

/**
 * Reads the numeric index from the filename.
 * @param {string} fileName
 * @returns {number} The parsed numeric index, or -1 if it's invalid or longer than 3 characters.
 */
function readIndex(fileName) {
  const match = fileName.match(indexRegex);
  return match === null ? -1 : parseInt(match[0].slice(0, -1));
}

/**
 * Serializes a numerical index to an index string
 */
function getIndexString(n) {
  const s = String(n);
  if (n < 0) throw Error("Negative index values are not permitted.");
  if (s.length > indexLength)
    throw Error("Index string exceeds the max length.");
  return s.padStart(indexLength, "0");
}

/**
 * Creates an indexer that can read and index duplicate filenames in a directory.
 * @param {string} dirPath
 */
async function createIndex(dirPath) {
  const files = await fs.readdir(dirPath);
  /** @type {{ [fileName: string]: number; }} */
  const index = {};

  loadIndex();

  function loadIndex() {
    for (const file of files) {
      const fileName = removeIndex(file);
      const fileIndex = readIndex(file);
      const currentIndex = index[fileName];

      if (currentIndex === undefined) {
        index[fileName] = 0;
      } else if (fileIndex > currentIndex) {
        index[fileName] = fileIndex;
      }
    }
  }

  function getIndex() {
    return index;
  }

  /**
   * @param {string} fileName
   */
  function incrementIndex(fileName) {
    let idx = index[fileName];

    if (idx === undefined) {
      index[fileName] = idx = 0;
      return idx;
    }

    return ++idx;
  }

  return { incrementIndex, getIndex };
}

module.exports = {
  getSuffix,
  sanitizeFilename,
  removeIndex,
  readIndex,
  createIndex,
  getIndexString,
};
