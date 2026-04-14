const {
  initConfig,
  AUDIO_ENCODING,
  AUDIO_LANGUAGE,
  AUDIO_NAMES,
} = require("../config.js");

describe("config", () => {
  /** @type {import('../config').APIConfig} */
  // @ts-ignore
  let config = {};

  beforeEach(() => {
    // Resets the config to pass validation.
    config = {
      apiKey: "test_key",
      input: {
        file: "test.txt",
      },
    };
  });

  test("config.apiKey throws when undefined", () => {
    delete config.apiKey;
    expect(() => initConfig(config)).toThrow();
  });

  test("input.file throws when undefined", () => {
    delete config.input.file;
    expect(() => initConfig(config)).toThrow();
  });

  test("config properly inits params", () => {
    const c = initConfig(config);
    expect(c.apiKey).toEqual("test_key");
    expect(c.input.file).toEqual("test.txt");
  });

  test("config properly inits defaults", () => {
    const c = initConfig(config);
    expect(c.input.delimiter).toEqual("\n");
    expect(c.output.dir).toEqual("./");
    expect(c.output.prefix).toEqual("");
    expect(c.audio.encoding).toEqual(AUDIO_ENCODING.DEFAULT);
    expect(c.audio.language).toEqual(AUDIO_LANGUAGE.DEFAULT);
    expect(c.audio.name).toEqual(AUDIO_NAMES.DEFAULT);
  });
});
