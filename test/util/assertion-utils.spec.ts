//import { describe, expect, test } from "@jest/globals";

import {
  //  ISwizzyLoggerProps,
  SwizzyWinstonLogger,
} from "../../dist/common/logger.js";
import { assertOrThrow } from "../../dist/util/assertion-util.js";
import test from "node:test";
import expect from "expect";

type ISwizzyLoggerProps = any;

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

test("Logger tests", () => {
  test.beforeEach(() => {
    defaultLogger = new SwizzyWinstonLogger(baseLoggerProps);
  });

  test.it("Should throw with no message", () => {
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

  test.it("Should throw with error message function", () => {
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

  test.it("Should throw with error message", () => {
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
