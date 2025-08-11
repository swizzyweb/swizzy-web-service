//import { describe, expect, test } from "@jest/globals";
import {
  //  ISwizzyLoggerProps,
  SwizzyWinstonLogger,
} from "../../dist/common/index.js";
import { Logger } from "winston";
import { readFileSync, rmdirSync } from "node:fs";
import path from "node:path";
import test, { mock } from "node:test";
import assert from "node:assert";
import expect from "expect";

import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { setTimeout } from "node:timers/promises";

// Equivalent of __filename
const __filename = fileURLToPath(import.meta.url);

// Equivalent of __dirname
const __dirname = dirname(__filename);

type ISwizzyLoggerProps = any;

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

const TIMEOUT = 1000;
test("Logger tests", () => {
  let mockLogger: any = {};
  let loggerSpy: any = {};
  test.beforeEach(() => {
    defaultLogger = new SwizzyWinstonLogger(baseLoggerProps);
    mockLogger = {
      log(d: any) {},
      info(d: any) {},
      error(d: any) {},
      debug(d: any) {},
      warn(d: any) {},
      //      getLoggerProps: mock.fn(),
      clone() {},
    };

    for (const method of loggerMethods) {
      loggerSpy[method] = mock.method(mockLogger, method, (d: any) => {});
    }
    defaultLogger.logger = mockLogger as Logger;
    //loggerSpy = jest.spyOn(defaultLogger, "logger");
  });

  test.it("should invoke winston with input props", () => {
    const message = "This is the log message";
    const arg1 = "hello";
    const arg2 = "world";

    // Perform interactions
    for (const method of loggerMethods) {
      defaultLogger[method](message, arg1, arg2);
    }

    // Validate interactions
    for (const method of loggerMethods) {
      expect(loggerSpy[method].mock.calls[0].arguments).toEqual([
        message,
        arg1,
        arg2,
      ]);
      //      expect(mockLogger[method]).toBeCalledWith(message, arg1, arg2);
    }

    // Swap args as it invokes info under the hood, and want
    // to ensure that we catch the second invocation.
    defaultLogger["log"](message, arg2, arg1);
    expect(loggerSpy.info.mock.calls[1].arguments).toEqual([
      message,
      arg2,
      arg1,
    ]);
  });

  test.it("Should log to file with custom file name", async () => {
    const appDataRoot = path.join(__dirname, "test-logs-custom");
    const logFileName = "myLogFile";
    const logger = new SwizzyWinstonLogger({
      ...baseLoggerProps,
      appDataRoot,
      logFileName,
    });

    const currentDate = new Date(Date.now());
    const logPath = path.join(
      appDataRoot,
      "logs",
      `${logFileName}.${currentDate.getFullYear()}-${currentDate.getUTCMonth() < 9 ? "0" : ""}${currentDate.getUTCMonth() + 1}-${currentDate.getUTCDate() < 9 ? "0" : ""}${currentDate.getUTCDate()}-00`,
    );

    const testLogString = "Test log from should set appDataRoot tests";

    logger.info(testLogString);
    console.warn(
      `WARN!!!! We are using a set timeout to deal with a concurreny issue with winston logger, timeout: ${TIMEOUT}ms`,
    );
    await setTimeout(500); //() => {
    const logs = readFileSync(logPath, "utf-8");

    expect(logs).toContain(testLogString);
    if (REMOVE_LOG_DIR_AFTER_TESTS) {
      rmdirSync(appDataRoot, { recursive: true });
    }
    //    }, TIMEOUT);
  });

  test.it("Should log to default file", async () => {
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
    await setTimeout(500); //() => {
    const logPath = path.join(appDataRoot, "logs/", logFileName);
    const logs = readFileSync(logPath, "utf-8");

    expect(logs).toContain(testLogString);
    if (REMOVE_LOG_DIR_AFTER_TESTS) {
      rmdirSync(appDataRoot, { recursive: true });
    }
    //    }, TIMEOUT);
  });
});
