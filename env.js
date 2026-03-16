import { exit } from "process";
import { config } from "dotenv";

const dotenv = config({ quiet: true }).parsed ?? {};

/**
 * Resolver that maintains precedence of env variables.
 * If `fallback` parameter is undefined, the resolver throws an error unless `quiet` set to true.
 * @param {string} name
 * @param {string | undefined} fallback
 * @param {boolean | undefined} quiet
 */
function resolve(name, fallback, quiet) {
  const e = process.env[name] ?? dotenv[name] ?? fallback;

  if (fallback === undefined && e === undefined && quiet !== true)
    throw TypeError(`Missing environment variable ${name}`);

  return e;
}

const env = {};

try {
  env.API_KEY = resolve("API_KEY", undefined, true);
} catch (err) {
  console.log(err.message);
  exit(1);
}

/**
 * The parsed environment variables with injected fallbacks.
 */
export default env;
