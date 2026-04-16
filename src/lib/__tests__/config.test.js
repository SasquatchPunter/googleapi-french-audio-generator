const {
  AUDIO_ENCODING,
  AUDIO_LANGUAGE,
  AUDIO_NAMES,
  initInputConfig,
  initOutputConfig,
  initAudioConfig,
} = require("../config.js");

/** @typedef {import('../config.js').InputConfig} InputConfig */
/** @typedef {Required<InputConfig>} CompleteInputConfig */
/** @typedef {import('../config.js').OutputConfig} OutputConfig */
/** @typedef {Required<OutputConfig>} CompleteOutputConfig */
/** @typedef {import('../config.js').AudioConfig} AudioConfig */
/** @typedef {Required<AudioConfig>} CompleteAudioConfig */

describe("config", () => {
  describe("initAudioConfig", () => {
    test("loads defaults", () => {
      /** @type {AudioConfig} */
      const config = {};
      /** @type {CompleteAudioConfig} */
      const expected = {
        language: AUDIO_LANGUAGE.DEFAULT,
        name: AUDIO_NAMES.DEFAULT,
        encoding: AUDIO_ENCODING.DEFAULT,
      };
      expect(initAudioConfig(config)).toEqual(expected);
    });

    test("throws on invalid config", () => {
      //@ts-expect-error
      expect(() => initAudioConfig({ language: "fff" })).toThrow();
      //@ts-expect-error
      expect(() => initAudioConfig({ name: "" })).toThrow();
      //@ts-expect-error
      expect(() => initAudioConfig({ encoding: "WAV" })).toThrow();
    });
  });

  describe("initInputConfig", () => {
    test("loads defaults", () => {
      /** @type {InputConfig} */
      const config = { file: "test.txt" };
      /** @type {CompleteInputConfig} */
      const expected = {
        file: "test.txt",
        delimiter: "\n",
      };

      expect(initInputConfig(config)).toEqual(expected);
    });

    test("throws on invalid config", () => {
      //@ts-expect-error
      expect(() => initInputConfig({})).toThrow();
    });
  });

  describe("initOutputConfig", () => {
    test("loads defaults", () => {
      /** @type {OutputConfig} */
      const config = {};
      /** @type {CompleteOutputConfig} */
      const expected = { dir: "./", prefix: "" };

      expect(initOutputConfig(config)).toEqual(expected);
    });
  });
});
