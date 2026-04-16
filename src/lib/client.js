const axios = require("axios");
const {
  AUDIO_ENCODING,
  AUDIO_LANGUAGE,
  AUDIO_NAMES,
  initAudioConfig,
} = require("./config.js");

/** @typedef {import('./config.js').AudioConfig} AudioConfig */
/** @typedef {{ audio?: AudioConfig; apiKey: string; apiVersion?: keyof typeof resources }} ClientConfig */
/** @typedef {{ audio: Required<AudioConfig>; apiKey: string; apiVersion: Required<ClientConfig['apiVersion']>; }} CompleteClientConfig */

/**
 * @typedef {typeof VERSION[keyof typeof VERSION]} Version
 */
const VERSION = Object.freeze({
  DEFAULT: "v1",
  V1: "v1",
  V1_BETA_1: "v1beta1",
});

const endpoint = "https://texttospeech.googleapis.com";
const resources = {
  v1: {
    text: "/v1/text:synthesize",
    list: "/v1/voices",
  },
};

/**
 * Client for accessing GoogleAPI's TTS service.
 */
class TTSClient {
  /** @type {CompleteClientConfig} */
  config;

  /**
   * Creates a client to talk to Google's TTS Service.
   * @param {ClientConfig} config
   */
  constructor(config) {
    this.config = this.parseConfig(config);
  }

  /**
   * Validates and loadw the input config.
   * @param {ClientConfig} config
   * @returns {CompleteClientConfig}
   */
  parseConfig(config) {
    if (config === undefined) throw Error("Config cannot be undefined!");
    if (typeof config.apiKey !== "string" || config.apiKey.length === 0)
      throw Error("Config option `apiKey` must be set!");

    const audio = initAudioConfig(config.audio || {});

    return {
      apiKey: config.apiKey,
      apiVersion: config.apiVersion || "v1",
      audio,
    };
  }

  /**
   * Fetches list of voices available for the client's language.
   * @param {typeof AUDIO_LANGUAGE[keyof typeof AUDIO_LANGUAGE]} lang Language code or codes to list voices for.
   */
  listVoices(lang = "fr-FR") {
    const url = endpoint + resources[this.config.apiVersion].list;
    const params = {
      languageCode: this.config.audio.language,
    };
    const method = "GET";
    const headers = {
      "X-goog-api-key": this.config.apiKey,
      "Content-Type": "application/json",
    };

    return axios({ url, params, method, headers });
  }

  /**
   * Synchronously generate a speech file from a input snippet.
   * @param {string} input
   * @param {AudioConfig} audioOptions
   */
  synthesizeSpeech(input, audioOptions = {}) {
    const url = endpoint + resources[this.config.apiVersion].text;
    const method = "POST";
    const headers = {
      "X-goog-api-key": this.config.apiKey,
      "Content-Type": "application/json",
    };
    const data = {
      input: {
        text: input,
      },
      voice: {
        languageCode: audioOptions.language || this.config.audio.language,
        name: audioOptions.name || this.config.audio.name,
      },
      audioConfig: {
        audioEncoding: audioOptions.encoding || this.config.audio.encoding,
      },
    };

    return axios({ url, method, headers, data });
  }
}

module.exports = { TTSClient };
