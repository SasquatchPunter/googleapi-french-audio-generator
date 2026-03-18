import cli from "./cli.js";
import env from "./env.js";

const config = {
  /** Google TTS API Key */
  apiKey: cli.key ?? env.API_KEY,
  /** Config settings for parsing inputs. */
  input: {
    file: cli.file,
    delimiter: cli.delimiter,
  },
  /** Config settings for writing outputs. */
  output: {
    dir: cli.output,
    prefix: cli.prefix,
  },
  /** Audio settings. */
  audio: {
    encoding: cli.encoding,
    language: cli.language,
    name: "fr-FR-Chirp3-HD-Achernar",
  },
};

export default config;
