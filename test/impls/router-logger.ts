import { SwizzyWinstonLogger } from "../../src/common";

const LOG_LEVEL = process.env.LOG_LEVEL ?? "error";

const loggerProps = {
  hostName: "hostName",
  appName: "appName",
  port: 3000,
  logLevel: LOG_LEVEL,
};
export const routerLogger = new SwizzyWinstonLogger(loggerProps);

export const webServiceLogger = routerLogger;

export const controllerLogger = routerLogger;

export const middlewareLogger = routerLogger;
