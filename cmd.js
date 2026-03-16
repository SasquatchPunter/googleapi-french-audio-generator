import { exit } from "process";
import { parseArgs } from "util";

const usageString = `Usage: command [options...] <file>
Takes options and a file path as the main argument.
The file is parsed as a newline-separated list of strings to synthesize speech for.

Options:
-e, --encoding <encoding>                Audio encoding to generate. Default: MP3. Options: MP3, LINEAR16, M4A
-k, --key                                Google API key. This will take precedence over the API_KEY environment variable.
-o, --output <output directory>          Directory to write output audio files to.
-p, --prefix <output prefix>             File prefix to use for output files.
-h, --help                               Prints the help message.

Outputs encoded audio files of generated speech in the encoding specified.`;

/**
 * @typedef {import('util').ParseArgsConfig} ParseArgsConfig
 * @type {ParseArgsConfig}
 */
const parserConfig = {
  args: process.argv.slice(2),
  options: {
    encoding: {
      type: "string",
      multiple: false,
      short: "e",
      default: "MP3",
    },
    output: {
      type: "string",
      multiple: false,
      short: "o",
      default: import.meta.dirname,
    },
    help: {
      type: "boolean",
      multiple: false,
      short: "h",
      default: false,
    },
    prefix: {
      type: "string",
      multiple: false,
      short: "p",
      default: "",
    },
    key: {
      type: "string",
      multiple: false,
      short: "k",
    },
  },
  tokens: true,
  allowPositionals: true,
};

/**
 * @typedef {{ range?: [ number, number ]; expected?: number; }} ValidationConfigPositionals
 * @typedef {{ [ longName: string ]: { required?: boolean; allowed?: string[]; } }} ValidationConfigOptions
 * @typedef {{ options?: ValidationConfigOptions; positionals?: ValidationConfigPositionals; }} ValidationConfig
 * @type {ValidationConfig}
 */
const validatorConfig = {
  options: {
    encoding: {
      required: true,
      allowed: ["MP3", "LINEAR16", "M4A"],
    },
    output: {
      required: true,
    },
    prefix: {
      required: true,
    },
  },
  positionals: {
    expected: 1,
  },
};

/**
 * Validate the parsed commandline arguments.
 * @param {ReturnType<typeof parseArgs>} parsedArgs
 * @param {ValidationConfig} validatorConfig
 * @param {ParseArgsConfig } parserConfig
 */
function validateArgs(parsedArgs, validatorConfig, parserConfig) {
  const { positionals, values } = parsedArgs;

  // Validate Positionals
  if (validatorConfig.positionals !== undefined) {
    const { expected, range } = validatorConfig.positionals;

    if (expected !== undefined) {
      if (expected !== positionals.length)
        throw Error(
          `Expected ${expected} arguments, got ${positionals.length}`,
        );
    } else if (range !== undefined) {
      const [min, max] = range;

      if (positionals.length < min || positionals.length > max) {
        throw Error(
          `Expected between ${min} and ${max} arguments, got ${positionals.length}`,
        );
      }
    }
  }

  // Validate Options
  if (validatorConfig.options !== undefined) {
    for (const optionName of Object.keys(validatorConfig.options)) {
      const option = validatorConfig.options[optionName];

      if (option.required === true) {
        if (!(optionName in values)) {
          throw Error(
            `Option '${parserConfig.options[optionName].short ?? optionName}' is required!`,
          );
        }
      }

      if (option.allowed !== undefined) {
        if (
          optionName in values &&
          !option.allowed.includes(values[optionName])
        )
          throw Error(
            `--${optionName} option must be one of the following: ${option.allowed.join(", ")}`,
          );
      }
    }
  }

  return parsedArgs;
}

/**
 * Cleanly exits and prints the usage text if user sets the "help" commandline flag.
 */
function checkHelpFlag() {
  const flags = ["-h", "--help"];

  flags.forEach((flag) => {
    if (parserConfig.args.includes(flag)) {
      console.log(usageString);
      exit(0);
    }
  });
}

/**
 * Runs the cli parser and validator before returning the parsed values.
 */
function run() {
  try {
    checkHelpFlag();

    const args = validateArgs(
      parseArgs(parserConfig),
      validatorConfig,
      parserConfig,
    );

    return {
      /** @type {string} */
      file: args.positionals[0],
      /** @type {string} */
      encoding: args.values.encoding,
      /** @type {string} */
      output: args.values.output,
      /** @type {string} */
      prefix: args.values.prefix,
      /** @type {string | undefined} */
      key: args.values.key,
    };
  } catch (err) {
    console.log(err.message);
    console.log(`\n${usageString}`);
    exit(1);
  }
}

/**
 * The parsed commandline arguments and options.
 */
export default run();
