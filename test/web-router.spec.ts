import { MyFirstWebRouter } from "./impls/test-web-router.ts";
import { middlewareLogger, routerLogger } from "./impls/router-logger.ts";
import request from "supertest";
import express from "express";
import { NoControllerWebRouter } from "./impls/no-controllers-web-router.ts";
import {
  RequestIdMiddleware,
  RequestLoggerMiddleware,
} from "../dist/middleware/index.js";
import test from "node:test";
import assert from "node:assert";
import { ConfigurableControllerWebRouter } from "./impls/configurable-controller-web-router.ts";
import { CreatorWebController } from "./impls/controller/creator-web-controller.ts";

function printPath(router: any) {
  console.error(`/${router.path}/${router.installedControllers[0].action}`);
}
test("WebRouter test", () => {
  let app: any;
  function getAppState() {
    return {
      memoryDb: {},
      creatorName: "creatorName",
      createdAt: Date.now(),
      currentUserName: "Jaymoney",
    };
  }
  let appState: any;
  test("MyFirstWebRouter", () => {
    test.beforeEach(() => {
      appState = getAppState();

      app = express();
      //      app.use(express.json()); // Middleware to parse JSON
    });
    test.it(
      "Should throw when router not initialized and attempt to retrieve router",
      async () => {
        const router = new MyFirstWebRouter({
          logger: routerLogger,
        });
        const errorMessage = new Error("failed not expected");
        try {
          router.router.bind(router)();
          throw errorMessage;
        } catch (e: any) {
          assert.equal(
            e.message,
            `Router is not defined, did you call initialize on this router?`,
          );
        }

        // expect(router.router.bind(router)).toThrow({
        //          name: "RouterNotInitializedError",
        //          message: `Router is not defined, did you call initialize on this router?`,
        //        });
      },
    );

    test.it("Should return default userName from hello api", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });
      await router.initialize({ appState });
      app.use("/api", router.router()); // Mount the router
      const response = await request(app).get("/api/hello");
      assert.deepEqual(response.body, { message: "Hello Jaymoney!" });
    });

    test.it("Should update userName", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });
      await router.initialize({
        appState,
      });
      app.use("/api/", router.router()); // Mount the router

      // TODO: take advantage of supertest chaining methods
      const response = await request(app)
        .post("/api/name")
        .send({ userName: "WannaWatchMeCode" })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({
          message: `Username has been updated from Jaymoney to WannaWatchMeCode`,
        });
    });

    test.it("Should get from hello controller", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });
      await router.initialize({
        appState,
      });
      app.use("/api/", router.router()); // Mount the router

      // TODO: take advantage of supertest chaining methods
      const response = await request(app)
        .get("/api/hello")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({ message: "Hello Jaymoney!" });
    });

    test.it(
      "Should update use global state to show creator and create time",
      async () => {
        const router = new MyFirstWebRouter({
          logger: routerLogger,
        });
        const createdAt = Date.now();
        const creatorName = "SwizzyWeb";

        await router.initialize({
          appState: {
            memoryDb: {},
            creatorName,
            createdAt,
            currentUserName: "WannaWatchMeCode",
          },
        });

        app.use("/api/", router.router()); // Mount the router
        // TODO: take advantage of supertest chaining methods
        const response = await request(app)
          .get("/api/creator/")
          .send()
          .expect("Content-Type", /json/)
          .expect(200)
          .expect({
            message: `The creator of this app is ${creatorName}`,
            createdAt,
          });
      },
    );

    test.it("Should set default path to api", () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });
      assert.equal(router.path, "api");
    });

    test.it("Should throw on router already initialized", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });

      await router.initialize({ appState });
      try {
        await router.initialize({ appState });
      } catch (e: any) {
        assert.equal(e.error, "WebRouterAlreadyInitializedException");
        assert.equal(e.message, "Web router is already initialized");
      }
    });
    test.it("Should throw on installedControllers exception", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });

      // @ts-ignore
      router.installControllers = () => {
        throw "ForcedInstallControllersException";
      };
      try {
        await router.initialize({ appState });
      } catch (e: any) {
        assert.equal(e.message, "Error initializing router");

        assert.notEqual(e.stack, undefined);
        assert.equal(e.error, "ForcedInstallControllersException");
      }
    });

    test.it(
      "Should throw with included stack on installedControllers throws exception with stack",
      async () => {
        const router = new MyFirstWebRouter({
          logger: routerLogger,
        });
        const exception = {
          type: "ForcedInstallControllersException",
          message: "An exception was forced",
          stack: new Error("ForcedInstallControllersException"),
        };

        // @ts-ignore
        router.installControllers = () => {
          throw exception;
        };
        try {
          await router.initialize({ appState });
        } catch (e: any) {
          assert.equal(e.message, "Error initializing router");
          assert.deepEqual(e.error, exception);
          assert.deepEqual(e.stack, exception.stack);

          assert.notEqual(e.stack, undefined);
        }
      },
    );

    test.it("Should return empty state before initialize", () => {
      const router = new NoControllerWebRouter({ logger: routerLogger });
      const state: any = router.getState();
      assert.deepEqual(state, {});
    });

    test.it("Should not install non existing controllers", async () => {
      const router: any = new NoControllerWebRouter({
        logger: routerLogger,
      });

      await router.initialize({ appState });
      assert.equal(router.installedControllers.length, 0);
      assert.notEqual(router.actualRouter, undefined);
      assert.equal(router.webControllerClasses.length, 0);
    });

    test.it(
      "Should throw on router already initialized with not controllers",
      async () => {
        const router: any = new NoControllerWebRouter({
          logger: routerLogger,
        });

        await router.initialize({ appState });

        try {
          await router.initialize({ appState });
        } catch (e: any) {
          assert.equal(e.error, "WebRouterAlreadyInitializedException");
          assert.equal(e.message, "Web router is already initialized");
        }
      },
    );

    test.it("Should maintain state between different controllers", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });

      await router.initialize({
        appState,
      });

      app.use("/api/", router.router()); // Mount the router

      const firstHelloResponse = await request(app)
        .get("/api/hello")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({ message: "Hello Jaymoney!" });

      const setNameResponse = await request(app)
        .post("/api/name")
        .send({ userName: "WannaWatchMeCode" })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({
          message: `Username has been updated from Jaymoney to WannaWatchMeCode`,
        });
      const secondHelloResponse = await request(app)
        .get("/api/hello")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({ message: "Hello WannaWatchMeCode!" });

      const secondSetNameResponse = await request(app)
        .post("/api/name")
        .send({ userName: "AnadaOne" })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({
          message: `Username has been updated from WannaWatchMeCode to AnadaOne`,
        });
    });

    test.it("Should work with installed middleware", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
        middleware: [RequestLoggerMiddleware],
      });

      await router.initialize({ appState });

      app.use("/api/", router.router()); // Mount the router

      const firstHelloResponse = await request(app)
        .get("/api/hello")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({ message: "Hello Jaymoney!" });

      const setNameResponse = await request(app)
        .post("/api/name")
        .send({ userName: "WannaWatchMeCode" })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({
          message: `Username has been updated from Jaymoney to WannaWatchMeCode`,
        });
      const secondHelloResponse = await request(app)
        .get("/api/hello")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({ message: "Hello WannaWatchMeCode!" });

      const secondSetNameResponse = await request(app)
        .post("/api/name")
        .send({ userName: "AnadaOne" })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({
          message: `Username has been updated from WannaWatchMeCode to AnadaOne`,
        });
    });

    test(`Should uninstall controller middlewares`, async () => {
      const router = new ConfigurableControllerWebRouter({
        webControllerClasses: [CreatorWebController],
        middleware: [RequestIdMiddleware, RequestLoggerMiddleware],
        logger: routerLogger,
      });

      await router.initialize({
        appState,
      });

      (router as any).uninstallMiddleware();
    });
  });
});
