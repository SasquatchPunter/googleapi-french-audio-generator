/** @typedef {{ file: string; delimiter?: string; }} InputConfig */
/** @typedef {{ dir?: string; prefix?: string; }} OutputConfig */
/** @typedef {{ encoding?: typeof AUDIO_ENCODING[keyof typeof AUDIO_ENCODING]; language?: typeof AUDIO_LANGUAGE[keyof typeof AUDIO_LANGUAGE]; name?: typeof AUDIO_NAMES[keyof typeof AUDIO_NAMES]; }} AudioConfig */
/** @typedef {{ apiKey: string; input?: InputConfig; output?: OutputConfig; audio?: AudioConfig; }} APIConfig */
/** @typedef {{ apiKey: string; input: Required<InputConfig>; output: Required<OutputConfig>; audio: Required<AudioConfig>; }} CompleteAPIConfig */

const AUDIO_ENCODING = Object.freeze({
  MP3: "MP3",
  LINEAR16: "LINEAR16",
  M4A: "M4A",
  DEFAULT: "MP3",
});

const AUDIO_LANGUAGE = Object.freeze({
  "FR-FR": "fr-FR",
  "FR-CA": "fr-CA",
  DEFAULT: "fr-FR",
});

const AUDIO_NAMES = Object.freeze({
  DEFAULT: "fr-FR-Chirp3-HD-Achernar",
});

/**
 * Initializes the API config.
 * @param {APIConfig} c
 * @returns {CompleteAPIConfig}
 */
function initConfig(c) {
  validateConfig(c);

  return {
    apiKey: c.apiKey,
    input: {
      file: c.input.file,
      delimiter: c.input?.delimiter || "\n",
    },
    output: {
      dir: c.output?.dir || "./",
      prefix: c.output?.prefix || "",
    },
    audio: {
      encoding: c.audio?.encoding || AUDIO_ENCODING.DEFAULT,
      language: c.audio?.language || AUDIO_LANGUAGE.DEFAULT,
      name: AUDIO_NAMES.DEFAULT,
    },
  };
}

/**
 * Validates the API config.
 * @param {APIConfig} c
 */
function validateConfig(c) {
  if (c === undefined) throw Error("No config is defined!");
  if (c.apiKey === undefined || c.apiKey.length === 0)
    throw Error("No API key was defined in the config!");
  if (c.input === undefined)
    throw Error("No input config options were defined!");
  if (c.input.file === undefined)
    throw Error("No input file was defined in the config!");
  if (c.audio !== undefined) {
    if (c.audio.encoding !== undefined && !(c.audio.encoding in AUDIO_ENCODING))
      throw Error(`${c.audio.encoding} is not a valid audio encoding!`);
    if (c.audio.language !== undefined && !(c.audio.language in AUDIO_LANGUAGE))
      throw Error(`${c.audio.language} is not a valid audio language!`);
  }
}

module.exports = { AUDIO_ENCODING, AUDIO_LANGUAGE, AUDIO_NAMES, initConfig };
