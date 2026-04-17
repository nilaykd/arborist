/** Using this length, according to [nanoid collision calculator](https://zelark.github.io/nano-id-cc/),
 * generating 1000 IDs per hour, it would take around 919 years to have 1 percent chance of a single collision.
 * This is okay for the "insecure" generator, which is used in limited cases where collisions are less likely.
 */
const SHORT_ID_LENGTH = 12;
/** Default length for nanoids. */
const LONG_ID_LENGTH = 23;

const alphanumericLowercase = "0123456789abcdefghijklmnopqrstuvwxyz";

// Cross-environment random byte source. Works in Node (global crypto since 18),
// browser/webview (window.crypto), and web workers.
function getRandomBytes(size: number): Uint8Array {
  const buf = new Uint8Array(size);
  const g: any =
    typeof globalThis !== "undefined" ? (globalThis as any) : undefined;
  if (g && g.crypto && typeof g.crypto.getRandomValues === "function") {
    g.crypto.getRandomValues(buf);
    return buf;
  }
  for (let i = 0; i < size; i += 1) {
    buf[i] = Math.floor(Math.random() * 256);
  }
  return buf;
}

function makeGenerator(alphabet: string, size: number, secure: boolean) {
  // eslint-disable-next-line no-bitwise
  const mask = (2 << Math.floor(Math.log(alphabet.length - 1) / Math.LN2)) - 1;
  const step = Math.ceil((1.6 * mask * size) / alphabet.length);
  return (): string => {
    let id = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const bytes = secure
        ? getRandomBytes(step)
        : (() => {
            const buf = new Uint8Array(step);
            for (let i = 0; i < step; i += 1) {
              buf[i] = Math.floor(Math.random() * 256);
            }
            return buf;
          })();
      for (let i = 0; i < step; i += 1) {
        // eslint-disable-next-line no-bitwise
        const byte = bytes[i] & mask;
        if (alphabet[byte] !== undefined) {
          id += alphabet[byte];
          if (id.length === size) return id;
        }
      }
    }
  };
}

/**
 * Generates a random identifier.
 *
 * Backward compatibility notes:
 * Previously this id has been generated differently including using
 * ------------------------------
 * * uuidv4(); from "uuid/v4";
 * * { v4 } from "uuid";
 * * nanoid(); from "nanoid";  uses: [A-Za-z0-9_-]
 * ------------------------------
 * Hence even though right now we only have alphanumeric ids, previously there
 * has been ids with `-` and `_` around, that still exist in our users notes.
 *
 * @returns A url-safe, random identifier.
 */
export const genUUID = makeGenerator(
  alphanumericLowercase,
  LONG_ID_LENGTH,
  true
);

/** Generates a shorter random identifier, faster but with potential cryptographic risks.
 *
 * Uses an insecure random generator for faster generation.
 * Also shortens the length of the generated IDs to 16 characters.
 * This increases the risk of collisions.
 * Only use this if performance is important and collisions are relatively unimportant.
 *
 * @returns A url-safe, random identifier.
 */
export const genUUIDInsecure = makeGenerator(
  alphanumericLowercase,
  SHORT_ID_LENGTH,
  false
);
