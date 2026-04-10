const { load, set } = require("./env.js");
const path = require("node:path");

describe("env.js", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "test";
    delete process.env.API_KEY;
  });

  test("load() won't throw with 0 args", () => {
    // Preload .env.test to quiet jkl;
    load(undefined, path.resolve(__dirname, ".env.test"));
    expect(() => load()).not.toThrow();
  });

  test("load() throws when API_KEY is undefined", () => {
    expect(() => load()).toThrow();
  });

  test("accepts and loads alternate file", () => {
    const filePath = path.resolve(__dirname, ".env.test");

    expect(() => load(undefined, filePath)).not.toThrow();
    expect(process.env.API_KEY).toEqual("test");
  });

  test("loads and inits API_KEY without erroring on init", () => {
    expect(() => load({ API_KEY: "test" })).not.toThrow();
    expect(process.env.API_KEY).toEqual("test");
  });

  test("set env variables after initial load", () => {
    const filePath = path.resolve(__dirname, ".env.test");

    load({}, filePath);

    set({ API_KEY: "untest" });

    expect(process.env.API_KEY).toEqual("untest");
  });
});
