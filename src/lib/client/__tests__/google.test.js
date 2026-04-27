const { TTSClient } = require("../google.js");

describe("TTSClient", () => {
  it("throws when config is undefined", () => {
    //@ts-ignore
    expect(() => new TTSClient(undefined)).toThrow();
  });

  it("throws when config.apiKey is undefined or empty", () => {
    expect(() => new TTSClient({})).toThrow();
    expect(() => new TTSClient({ apiKey: "" })).toThrow();
  });

  it("inits when config.apiKey is defined", () => {
    expect(() => new TTSClient({ apiKey: "test" })).not.toThrow();
  });
});
