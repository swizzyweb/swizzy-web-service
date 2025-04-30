import { describe, expect, test } from "@jest/globals";
import {
  ISwizzyLoggerProps,
  SwizzyWinstonLogger,
} from "../../src/common/logger";
import { assertOrThrow } from "../../src/util/assertion-util";

let defaultLogger;
const baseLoggerProps: ISwizzyLoggerProps = {
  hostName: "hostName",
  port: 80,
  appName: "appName",
};
interface Args {
  left: number;
  right: number;
}
const failureArgs: Args = {
  left: 1,
  right: 0,
};

describe("Logger tests", () => {
  beforeEach(() => {
    defaultLogger = new SwizzyWinstonLogger(baseLoggerProps);
  });

  it("Should throw with no message", () => {
    try {
      assertOrThrow({
        args: failureArgs,
        assertion: (args) => args.left === args.right,
      });
    } catch (e: any) {
      expect(e.message).toEqual(
        `Assertion failed with args: ${JSON.stringify(failureArgs)}`,
      );
    }
  });

  it("Should throw with error message function", () => {
    const messageFunction = (args: Args) =>
      `${args.left} does not equal ${args.right}`;
    try {
      assertOrThrow({
        args: failureArgs,
        assertion: (args) => args.left === args.right,
        errorMessage: messageFunction,
      });
    } catch (e: any) {
      expect(e.message).toEqual(messageFunction(failureArgs));
    }
  });

  it("Should throw with error message", () => {
    const message = `assert failed`;
    try {
      assertOrThrow({
        args: failureArgs,
        assertion: (args) => args.left === args.right,
        errorMessage: message,
      });
    } catch (e: any) {
      expect(e.message).toEqual(message);
    }
  });
});
