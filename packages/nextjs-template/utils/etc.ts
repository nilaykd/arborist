import { LOG_LEVEL } from "@dendronhq/common-frontend";

export function getLogLevel(): LOG_LEVEL {
  const env = typeof process !== "undefined" && process.env ? process.env : {};
  const logLevel = env.LOG_LEVEL || LOG_LEVEL.INFO;
  if (!Object.values(LOG_LEVEL).includes(logLevel as LOG_LEVEL)) {
    return LOG_LEVEL.INFO;
  }
  return logLevel as LOG_LEVEL;
}
