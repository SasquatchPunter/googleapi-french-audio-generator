import axios from "axios";

/**
 * @typedef {{ languageCode: string; name: string; }} VoiceConfig
 * @typedef {{ audioEncoding: string; }} AudioConfig
 * @typedef {{ key: string; }} APIConfig
 * @typedef {{ voice: VoiceConfig; audioConfig: AudioConfig; api: APIConfig }} ClientConfig
 */

class TTSClient {
  /** @type {ClientConfig} */
  #config;

  #endpoint = "https://texttospeech.googleapis.com";
  #resources = {
    text: "/v1/text:synthesize",
    list: "/v1/voices",
  };

  /**
   * Creates a client to talk to Google's TTS Service.
   * @param {ClientConfig} config
   */
  constructor(config) {
    this.#config = config;
  }

  /**
   * Fetches list of voices available for the client's language.
   */
  async listVoices() {
    const requestConfig = {
      method: "GET",
      headers: {
        "X-goog-api-key": this.#config.api.key,
        "Content-Type": "application/json",
      },
      url:
        this.#endpoint +
        this.#resources.list +
        "?languageCode=" +
        this.#config.voice.languageCode,
    };

    return axios(requestConfig);
  }

  /**
   * Synchronously generate a speech file from a text snippet.
   * @param {string} text
   */
  async synthesizeSpeech(text) {
    const requestConfig = {
      method: "POST",
      headers: {
        "X-goog-api-key": this.#config.api.key,
        "Content-Type": "application/json",
      },
      url: this.#endpoint + this.#resources.text,
      data: {
        input: { text },
        voice: {
          languageCode: this.#config.voice.languageCode,
          name: this.#config.voice.name,
        },
        audioConfig: {
          audioEncoding: this.#config.audioConfig.audioEncoding,
        },
      },
    };

    return await axios(requestConfig);
  }
}

export { TTSClient };
