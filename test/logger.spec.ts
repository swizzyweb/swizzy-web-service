import { describe, expect, test } from "@jest/globals";
import { ISwizzyLoggerProps, SwizzyWinstonLogger } from "../src/util/logger";

let defaultLogger;
const baseLoggerProps: ISwizzyLoggerProps = {
  hostName: "hostName",
  port: 80,
  appName: "appName",
};
describe("Logger tests", () => {
  beforeEach(() => {
    defaultLogger = new SwizzyWinstonLogger(baseLoggerProps);
  });
  it("should log with .log()", () => {});
});
