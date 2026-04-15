const { parseString, parseBuffer, parseFile } = require("../parser.js");
const path = require("node:path");

describe(parseString, () => {
  test("parses an empty string into an empty array", () => {
    expect(parseString("")).toHaveLength(0);
  });

  test("parses a newline-separated string into an array", () => {
    const str = "a\nb\nc\nd";
    expect(parseString(str)).toEqual(["a", "b", "c", "d"]);
  });

  test("parses a comma-separated string into an array", () => {
    const str = "e,f,g,h";
    expect(parseString(str, ",")).toEqual(["e", "f", "g", "h"]);
  });
});

describe(parseBuffer, () => {
  test("parses an empty buffer into an empty array", () => {
    const buffer = Buffer.from("");
    expect(parseBuffer(buffer)).toHaveLength(0);
  });

  test("parses a newline-separated string into an array", () => {
    const buffer = Buffer.from("a\nb\nc\nd");
    expect(parseBuffer(buffer)).toEqual(["a", "b", "c", "d"]);
  });

  test("parses a comma-seprated string into an array", () => {
    const buffer = Buffer.from("e,f,g,h");
    expect(parseBuffer(buffer, ",")).toEqual(["e", "f", "g", "h"]);
  });
});

describe(parseFile, () => {
  describe("parses a text file into an array", () => {
    test("using absolute path", async () => {
      const filePath = path.resolve(__dirname, "./parse.txt");
      expect(await parseFile(filePath)).toEqual(["a", "b", "c", "d"]);
    });
  });
});
