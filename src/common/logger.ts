/**
 * @module Loggers
 */
import { BaseLogger, BrowserLogger, ILogger } from "@swizzyweb/swizzy-common";
import { createLogger, format, info, level, Logger, transports } from "winston";
import * as path from "path";
import "winston-daily-rotate-file";
import { mkdirSync } from "fs";

/**
 * Constructor props for SwizzyWinstonLogger.
 */
export interface ISwizzyLoggerProps {
  hostName: string;
  appName: string;
  instanceId?: string;
  logDir?: string;
  appDataRoot?: string; //TODO: deprecate
  port: number;
  pid?: number;
  logLevel?: string;
  ownerName?: string;
  logFileName?: string;
}

/**
 * Winston based logger.
 */
export class SwizzyWinstonLogger extends BaseLogger<ISwizzyLoggerProps> {
  /**
   * Winston logger.
   **/
  logger: Logger;
  constructor(props: ISwizzyLoggerProps) {
    super(props);
    const {
      appName,
      instanceId,
      appDataRoot,
      port,
      hostName,
      logLevel,
      pid,
      ownerName,
      logFileName,
      logDir,
    } = props;

    const label = `${appendOrNothing(hostName)}${appendOrNothing(port)}${appendOrNothing(instanceId)}${appendOrNothing(appName)}${appendOrNothing(pid)}${appendOrNothing(ownerName)}`;

    let resultMessage = "";
    const consoleLogFormat = format.combine(
      format.timestamp(),
      format.label({ label }),
      format.colorize({
        all: true,
      }),
    );
    const loggerTransports: any[] = [
      new transports.Console({
        format: consoleLogFormat,
      }),
    ];
    resultMessage += "Setup console logger\n";
    const loggerFormat = format.combine(
      format.timestamp(),
      format.json(),
      format.label({ label }),
    );

    // Checkout this sorcery!
    let loggerDir = logDir
      ? logDir
      : appDataRoot
        ? `${appDataRoot}`
        : undefined;

    if (loggerDir) {
      const dirname = path.join(loggerDir, "/logs");
      mkdirSync(dirname, { recursive: true });

      // TODO: this seems to be async, so the logger is not always initialized
      // by the time this returns. Or something else in here is async, maybe
      // the file transport.
      loggerTransports.push(
        new transports.DailyRotateFile({
          format: loggerFormat,
          dirname,
          filename: logFileName ?? `${appName}-${hostName}-%DATE%.log`,
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          frequency: "24h",
          utc: true,
        }),
      );

      resultMessage += `loggerDir set, setting log directory to ${dirname}`;
    }

    this.logger = createLogger({
      format: loggerFormat,
      transports: loggerTransports,
      level: logLevel ?? "info",
    });
  }

  log(val: string, ...meta: any[]): void {
    this.info(val, ...meta);
  }
  info(val: string, ...meta: any[]): void {
    this.logger.info(val, ...meta);
  }
  error(val: string, ...meta: any[]): void {
    this.logger.error(val, ...meta);
  }
  warn(val: string, ...meta: any[]): void {
    this.logger.warn(val, ...meta);
  }
  debug(val: string, ...meta: any[]): void {
    this.logger.debug(val, ...meta);
  }
}

function appendOrNothing(val?: any) {
  return val && val !== "undefined" ? `${val}:` : ":";
}
