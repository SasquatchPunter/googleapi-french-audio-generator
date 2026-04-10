const { TTSClient } = require("./client.js");

describe("TTSClient", () => {
  it("throws when config is undefined", () => {
    expect(() => new TTSClient(undefined)).toThrow();
  });

  it("throws when config.apiKey is undefined or empty", () => {
    expect(() => new TTSClient({ apiKey: undefined })).toThrow();
    expect(() => new TTSClient({ apiKey: "" })).toThrow();
  });

  it("inits when config.apiKey is defined", () => {
    expect(() => new TTSClient({ apiKey: "test" })).not.toThrow();
  });
});
