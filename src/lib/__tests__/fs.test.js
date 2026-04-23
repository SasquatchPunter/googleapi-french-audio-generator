const {
  removeIndex,
  readIndex,
  createIndex,
  getIndexString,
} = require("../fs.js");
const fs = require("node:fs/promises");

describe(removeIndex, () => {
  test("removes index", () => {
    expect(removeIndex("000-file.txt")).toEqual("file.txt");
  });

  test("leaves unindexed files", () => {
    expect(removeIndex("file.txt")).toEqual("file.txt");
  });
});

describe(readIndex, () => {
  test("reads index", () => {
    expect(readIndex("007-test.txt")).toEqual(7);
    expect(readIndex("999-test.txt")).toEqual(999);
  });

  test("returns -1 if index isn't prefixed", () => {
    expect(readIndex("test.txt")).toEqual(-1);
  });

  test("returns -1 if index length is too long", () => {
    expect(readIndex("9999-test.txt")).toEqual(-1);
  });
});

describe("createIndex()", () => {
  const mockReturn = ["001-a", "002-a", "004-a", "b"];
  //@ts-ignore
  // Some type fighting weirdness here, gonna ignore it for now.
  jest.spyOn(fs, "readdir").mockResolvedValue(mockReturn);

  test("correctly loads the index", async () => {
    const index = await createIndex(__dirname);
    expect(index.getIndex().a).toBe(4);
    expect(index.getIndex().b).toBe(0);
  });

  describe("incrementIndex()", () => {
    test("initializes new fileNames in the index", async () => {
      const index = await createIndex(__dirname);
      expect(index.incrementIndex("new")).toBe(0);
      expect(index.incrementIndex("new")).toBe(1);
    });

    test("increments fileNames in the index", async () => {
      const index = await createIndex(__dirname);
      expect(index.incrementIndex("a")).toBe(5);
      expect(index.incrementIndex("b")).toBe(1);
    });
  });
});

describe(getIndexString, () => {
  test("outputs correctly", () => {
    expect(getIndexString(0)).toEqual("000");
    expect(getIndexString(20)).toEqual("020");
    expect(getIndexString(999)).toEqual("999");
  });

  test("throws when index is too high or too low", () => {
    expect(() => getIndexString(1000)).toThrow();
    expect(() => getIndexString(-1)).toThrow();
  });
});
