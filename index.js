import { writeFile, mkdir } from "fs/promises";

import env from "./env.js";
import cmd from "./cmd.js";
import { TTSClient } from "./api.js";

const { API_ENDPOINT, API_KEY } = env;
const { positionals, values, tokens } = cmd;

const client = new TTSClient({
  voice: { languageCode: "fr-FR", name: "fr-FR-Chirp3-HD-Achernar" },
  audioConfig: { audioEncoding: "MP3" },
  api: { key: API_KEY },
});

client.listVoices().then(({ data }) => console.log(data));

// client.synthesizeSpeech("attraper").then(({ data }) => {
//   const buffer = Buffer.from(data.audioContent, "base64");
//   writeFile("out.mp3", buffer);
// });
