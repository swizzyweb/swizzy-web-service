import { ILogger } from "@swizzyweb/swizzy-common";
import { timeStamp } from "node:console";
import { json } from "node:stream/consumers";
import { createLogger, format, info, level, Logger, transports } from "winston";
import * as path from "path";
import "winston-daily-rotate-file";
export interface ISwizzyLoggerProps {
  hostName: string;
  appName: string;
  instanceId?: string;
  logDir?: string;
  appDataRoot?: string; //TODO: deprecate
  port: number;
  pid?: number;
  logLevel?: string;
}

export class SwizzyWinstonLogger implements ILogger {
  logger: Logger;

  constructor(props?: ISwizzyLoggerProps) {
    const {
      appName,
      instanceId,
      appDataRoot,
      port,
      hostName,
      logLevel,
      pid,
      logDir,
    } = props ?? {};
    //    const myLabel = {hostName, port, instanceId, appName};
    const label = `${hostName}:${port}:${instanceId}:${appName}${pid ? `:${pid}` : ""}`;

    //const myFormat = printf(({ level, message, label, timestamp }) => {
    //    return `${timestamp} [${label}] ${level}: ${message}`;
    //    });
    const loggerFormat = format.combine(
      format.timestamp(),
      format.json(),
      format.label({ label: label }),
    );

    const loggerTransports: any[] = [
      new transports.Console({
        format: loggerFormat,
      }),
    ];

    if (appDataRoot) {
      const dirname = path.join(appDataRoot, "/logs");
      console.log(`has app data root, configuring file transport ${dirname}`);

      loggerTransports.push(
        new transports.DailyRotateFile({
          format: loggerFormat,
          dirname,
          filename: `${appName}-${hostName}-%DATE%.log`,
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          frequency: "24h",
        }),
      );
    }

    console.debug(`transports: ${loggerTransports}`);

    this.logger = createLogger({
      format: loggerFormat,
      transports: loggerTransports,
      level: logLevel ?? "info",
    });
  }

  log(val: string, ...meta: any[]): void {
    this.logger.log("info", val, ...meta);
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
