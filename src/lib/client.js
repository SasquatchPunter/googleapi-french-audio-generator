const axios = require("axios");
const { AUDIO_ENCODING, AUDIO_LANGUAGE, AUDIO_NAMES } = require("./config.js");

/** @typedef {import('./config.js').AudioConfig} AudioConfig */
/** @typedef {{ audio?: AudioConfig; apiKey: string; apiVersion?: keyof typeof resources }} ClientConfig */
/** @typedef {{ audio: Required<AudioConfig>; apiKey: string; apiVersion: Required<ClientConfig['apiVersion']>; }} CompleteClientConfig */

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

    return {
      apiKey: config.apiKey,
      apiVersion: config.apiVersion || "v1",
      audio: {
        encoding: config.audio?.encoding || AUDIO_ENCODING.DEFAULT,
        language: config.audio?.language || AUDIO_LANGUAGE.DEFAULT,
        name: config.audio?.name || AUDIO_NAMES.DEFAULT,
      },
    };
  }

  /**
   * Fetches list of voices available for the client's language.
   */
  listVoices() {
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
