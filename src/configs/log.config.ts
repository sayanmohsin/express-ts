// environment variables
const { env }: any = process;

import { ErrorHandler } from "@utils/server.util";
import { createLogger, format, Logger, transports } from "winston";
import expressWinston from "express-winston";

const loggerMainConfig = {
  level: "info",
  silent: false,
  exitOnError: false,
  format: format.combine(
    format.json(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
    format.align(),
    format.printf(
      info => `${info.timestamp} ${info.level.toUpperCase()}:${info.message}`,
    ),
  ),
  transports: [new transports.Console()],
};

const loggerMwConfig = {
  ...loggerMainConfig,
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
};

export declare let logger: Logger;

export const initLogger = async () => {
  try {
    switch (env.NODE_ENV) {
      case "production":
        loggerMainConfig.level = "info";
        loggerMwConfig.level = "info";
        break;

      case "development":
        loggerMainConfig.level = "debug";
        loggerMwConfig.level = "debug";
        break;

      case "test":
        loggerMainConfig.level = "error";
        loggerMwConfig.level = "error";
        loggerMainConfig.silent = true;
        loggerMainConfig.silent = true;
        break;

      default:
        loggerMainConfig.level = "info";
        loggerMwConfig.level = "info";
        break;
    }

    logger = createLogger(loggerMainConfig);

    logger.info("logger created🗒");
  } catch (e: any) {
    throw new ErrorHandler(400, e);
  }
};

export const loggerMw = () => expressWinston.logger(loggerMwConfig);
