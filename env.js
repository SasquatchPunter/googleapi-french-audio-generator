import { exit } from "process";
import { config } from "dotenv";

const dotenv = config({ quiet: true }).parsed ?? {};

/**
 * Resolver that maintains precedence of env variables.
 * If `fallback` parameter is undefined, the resolver throws an error.
 * @param {string} name
 * @param {string | undefined} fallback
 */
function resolve(name, fallback) {
  const e = process.env[name] ?? dotenv[name] ?? fallback;

  if (fallback === undefined && e === undefined)
    throw TypeError(`Missing environment variable ${name}`);

  return e;
}

const env = {};

try {
  env.API_KEY = resolve("API_KEY");
  env.API_ENDPOINT = resolve(
    "API_ENDPOINT",
    "https://texttospeech.googleapis.com/v1/text:synthesize",
  );
} catch (err) {
  console.log(err.message);
  exit(1);
}

/**
 * The parsed environment variables with injected fallbacks.
 */
export default env;
