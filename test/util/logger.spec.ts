import { describe, expect, test } from "@jest/globals";
import { ISwizzyLoggerProps, SwizzyWinstonLogger } from "../../src/common";
import { Logger } from "winston";
import { readFileSync, rmdirSync } from "node:fs";
import path from "node:path";

let defaultLogger: any;
let logger: SwizzyWinstonLogger;
const baseLoggerProps: ISwizzyLoggerProps = {
  hostName: "hostName",
  port: 80,
  appName: "appName",
};
const REMOVE_LOG_DIR_AFTER_TESTS =
  (process.env.REMOVE_LOG_DIR_AFTER_TEST ?? "TRUE").toUpperCase() === "TRUE";
const loggerMethods = ["info", "error", "warn", "debug"];
let loggerSpy;

const TIMEOUT = 500;
describe("Logger tests", () => {
  let mockLogger: any = {};
  beforeEach(() => {
    defaultLogger = new SwizzyWinstonLogger(baseLoggerProps);
    for (const method of loggerMethods) {
      mockLogger[method] = jest.fn();
    }
    defaultLogger.logger = mockLogger as Logger;
    //loggerSpy = jest.spyOn(defaultLogger, "logger");
  });

  it("should invoke winston with input props", () => {
    const message = "This is the log message";
    const arg1 = "hello";
    const arg2 = "world";

    // Perform interactions
    for (const method of loggerMethods) {
      defaultLogger[method](message, arg1, arg2);
    }

    // Validate interactions
    for (const method of loggerMethods) {
      expect(mockLogger[method]).toBeCalledWith(message, arg1, arg2);
    }

    // Swap args as it invokes info under the hood, and want
    // to ensure that we catch the second invocation.
    defaultLogger["log"](message, arg2, arg1);
    expect(mockLogger.info).toBeCalledWith(message, arg2, arg1);
  });

  it("Should log to file with custom file name", () => {
    const appDataRoot = path.join(__dirname, "test-logs");
    const logFileName = "myLogFile";
    const logger = new SwizzyWinstonLogger({
      ...baseLoggerProps,
      appDataRoot,
      logFileName,
    });
    const currentDate = new Date(Date.now());
    const logPath = path.join(
      appDataRoot,
      "/logs/",
      `${logFileName}.${currentDate.getFullYear()}-${currentDate.getUTCMonth() < 9 ? "0" : ""}${currentDate.getUTCMonth() + 1}-${currentDate.getUTCDate() < 9 ? "0" : ""}${currentDate.getUTCDate()}-00`,
    );

    const testLogString = "Test log from should set appDataRoot tests";

    logger.info(testLogString);
    console.warn(
      `WARN!!!! We are using a set timeout to deal with a concurreny issue with winston logger, timeout: ${TIMEOUT}ms`,
    );
    setTimeout(() => {
      const logs = readFileSync(logPath, "utf-8");

      expect(logs).toContain(testLogString);
      if (REMOVE_LOG_DIR_AFTER_TESTS) {
        rmdirSync(appDataRoot, { recursive: true });
      }
    }, TIMEOUT);
  });

  it("Should log to default file", () => {
    const appDataRoot = path.join(__dirname, "test-logs");
    const { appName, hostName } = baseLoggerProps;

    const currentDate = new Date(Date.now());
    const date = `${currentDate.getUTCFullYear()}-${currentDate.getUTCMonth() < 9 ? "0" : ""}${currentDate.getUTCMonth() + 1}-${currentDate.getUTCDate() < 9 ? "0" : ""}${currentDate.getUTCDate()}-00`;
    const logFileName = `${appName}-${hostName}-${date}.log`;
    const logger = new SwizzyWinstonLogger({
      ...baseLoggerProps,
      appDataRoot,
    });
    const testLogString = "Test log from should set appDataRoot tests";

    logger.info(testLogString);
    console.warn(
      `WARN!!!! We are using a set timeout to deal with a concurreny issue with winston logger, timeout: ${TIMEOUT}ms`,
    );
    setTimeout(() => {
      const logPath = path.join(appDataRoot, "/logs/", logFileName);
      const logs = readFileSync(logPath, "utf-8");

      expect(logs).toContain(testLogString);
      if (REMOVE_LOG_DIR_AFTER_TESTS) {
        rmdirSync(appDataRoot, { recursive: true });
      }
    }, TIMEOUT);
  });
});
