/** @typedef {{ file: string; delimiter?: string; }} InputConfig */
/** @typedef {{ dir?: string; prefix?: string; }} OutputConfig */
/** @typedef {{ encoding?: typeof AUDIO_ENCODING[keyof typeof AUDIO_ENCODING]; language?: typeof AUDIO_LANGUAGE[keyof typeof AUDIO_LANGUAGE]; name?: typeof AUDIO_NAMES[keyof typeof AUDIO_NAMES]; }} AudioConfig */

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
 * Initializes and returns a complete input config.
 * @param {InputConfig} config
 * @returns {Required<InputConfig>}
 */
function initInputConfig(config) {
  if (config.file === undefined)
    throw Error("Missing required `file` configuration option!");

  return {
    file: config.file,
    delimiter: config.delimiter ?? "\n",
  };
}

/**
 * Initializes and returns a complete output config.
 * @param {OutputConfig} config
 * @returns {Required<OutputConfig>}
 */
function initOutputConfig(config) {
  return {
    dir: config.dir ?? "./audio",
    prefix: config.prefix ?? "",
  };
}

/**
 * Initializes and returns a complete audio config.
 * @param {AudioConfig} config
 * @returns {Required<AudioConfig>}
 */
function initAudioConfig(config) {
  if (config.name !== undefined) {
    if (!Object.values(AUDIO_NAMES).includes(config.name))
      throw Error(
        `${config.name} is not in the supported list of audio names!`,
      );
  }

  if (config.language !== undefined) {
    if (!Object.values(AUDIO_LANGUAGE).includes(config.language))
      throw Error(
        `${config.language} is not in the supported list of audio language codes!`,
      );
  }

  if (config.encoding !== undefined) {
    if (!Object.values(AUDIO_ENCODING).includes(config.encoding))
      throw Error(
        `${config.encoding} is not in the supported list of audio encodings!`,
      );
  }

  return {
    name: AUDIO_NAMES.DEFAULT,
    language: AUDIO_LANGUAGE.DEFAULT,
    encoding: AUDIO_ENCODING.DEFAULT,
  };
}

module.exports = {
  AUDIO_ENCODING,
  AUDIO_LANGUAGE,
  AUDIO_NAMES,
  initInputConfig,
  initOutputConfig,
  initAudioConfig,
};
