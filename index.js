import { writeFile, mkdir } from "fs/promises";
import config from "./config.js";
import { TTSClient } from "./client.js";

const client = new TTSClient({
  voice: { languageCode: config.audio.language, name: config.audio.name },
  audioConfig: { audioEncoding: config.audio.encoding },
  api: { key: config.apiKey },
});

client.listVoices().then(({ data }) => console.log(data));
