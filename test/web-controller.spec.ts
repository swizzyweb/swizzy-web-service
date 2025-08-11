import { error } from "node:console";
import expect from "expect";
import { HelloWebController } from "./impls/controller/hello-web-controller.ts";
import { NameWebController } from "./impls/controller/name-web-controller.ts";
import { controllerLogger } from "./impls/router-logger.ts";
// @ts-ignore
import express from "@swizzyweb/express";
import request from "supertest";
import test from "node:test";
import assert from "node:assert";
const routerState = {
  memoryDb: {},
  creatorName: "creatorName",
  createdAt: Date.now(),
  currentUserName: "WannaWatchMeCode",
};

test("WebController tests", () => {
  test.it(
    "Should throw when calling installableController() before initialize",
    async () => {
      const webController = new HelloWebController({
        logger: controllerLogger,
      });
      try {
        const { action, middleware, controller } =
          webController.installableController();
      } catch (e) {
        expect(e).toMatchObject({});
      }
    },
  );

  test.it("Should return installableController", async () => {
    const webController = new HelloWebController({ logger: controllerLogger });
    await webController.initialize({ routerState });
    const { action, middleware, controller } =
      webController.installableController();

    expect(action).toEqual("hello");
    expect(middleware.length).toEqual(0);
    expect(controller).toBeDefined();
    expect(typeof controller).toEqual("function");
  });

  test.it("Should include middleware in installableController", async () => {
    const webController = new NameWebController({ logger: controllerLogger });
    await webController.initialize({ routerState });
    const { action, middleware, controller } =
      webController.installableController();

    expect(action).toEqual("name");
    expect(middleware.length).toEqual(1);
    expect(controller).toBeDefined();
    expect(typeof controller).toEqual("function");
  });

  test.it("Should throw on getIntiailizedController throws", async () => {
    const webController = new NameWebController({ logger: controllerLogger });
    // @ts-ignore
    webController.getInitializedController = () => {
      throw "ForcedGetInitializedControllerException";
    };
    try {
      await webController.initialize({ routerState });
    } catch (e: any) {
      expect(e).toMatchObject({
        message: "Error initializing controller",
      });

      expect(e.stack).toBeDefined();
      expect(e.error).toEqual("ForcedGetInitializedControllerException");
    }
  });

  test.it(
    "Should throw with included stack on getIntiailizedController throws with stack",
    async () => {
      const webController = new NameWebController({ logger: controllerLogger });
      const exception = {
        type: "ForcedGetInitializedControllerException",
        message: "An exception was forced",
        stack: new Error("ForcedGetInitializedControllerException"),
      };
      // @ts-ignore
      webController.getInitializedController = () => {
        throw exception;
      };
      try {
        await webController.initialize({ routerState });
      } catch (e: any) {
        expect(e).toEqual({
          message: "Error initializing controller",
          stack: e.stack,
          error: exception,
        });
        expect(e.stack).toBeDefined();
      }
    },
  );

  test("Integration tests", () => {
    test.it(
      "Should properly handle post request to name controller",
      async () => {
        const webController = new NameWebController({
          logger: controllerLogger,
        });
        await webController.initialize({ routerState });
        const { action, middleware, controller } =
          webController.installableController();
        const app = express();
        app[webController.method]("/" + action, middleware, controller);
        const response = await request(app)
          .post("/name")
          .send({ userName: "Jaymoney" })
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message: `Username has been updated from WannaWatchMeCode to Jaymoney`,
          });
      },
    );
  });
});
