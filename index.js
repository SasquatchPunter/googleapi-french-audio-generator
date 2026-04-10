const { load } = require("./src/lib/env.js");
const { TTSClient } = require("./src/lib/client.js");

load();

const client = new TTSClient({ apiKey: process.env.API_KEY });
