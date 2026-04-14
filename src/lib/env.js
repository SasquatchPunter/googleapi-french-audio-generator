const { config, populate } = require("dotenv");

/**
 * Variable config that's used to validate variables in `process.env`.
 * @type {{ [name: string]: { required?: boolean; default?: any; } }}
 */
const validations = {
  API_KEY: { required: true },
};

/** Map of `NODE_ENV` values to environment files. */
const envFile = {
  production: ".env",
  test: ".env.test",
  development: ".env.development",
};

/**
 * Calls dotenv to load and validate environment variables. An optional map of variable names and values can be included to initialize the environment.
 * This should be called before any envrionment variables are read!
 * @param {{ [name: string]: string | undefined }} [varMap]
 * @param {string | string[]} [path]
 */
function load(varMap = {}, path) {
  populateDefaults();
  config({
    quiet: true,
    path: path ?? envFile[process.env.NODE_ENV],
    override: true,
  });
  populate(process.env, varMap, { override: true });

  validate();
}

/**
 * Uses `dotenv`'s `populate` function to override and load environment variables.
 * Whenever this is called, `process.env` is revalidated.
 * @param {{ [name: string]: any; }} varMap
 */
function set(varMap) {
  populate(process.env, varMap, { override: true });
  validate();
}

/** Pre-populates `process.env` with configured defaults. */
function populateDefaults() {
  const mappedDefaults = Object.fromEntries(
    Object.entries(validations)
      .filter((v) => v[1].default !== undefined)
      .map(([name, opts]) => [name, opts.default]),
  );
  populate(process.env, mappedDefaults, {
    override: false,
  });
}

/** Validates and performs checks on `process.env`. Errors are thrown on invalidations. */
function validate() {
  for (const [name, options] of Object.entries(validations)) {
    const v = process.env[name];

    if (options.required === true && v === undefined)
      throw Error(`Missing required environment variable ${name}!`);
  }
}

module.exports = {
  load,
  set,
};
