import { MyFirstWebRouter } from "./impls/test-web-router";
import { routerLogger } from "./impls/router-logger";
import request from "supertest";
// @ts-ignore
import express from "@swizzyweb/express";
import { NoControllerWebRouter } from "./impls/no-controllers-web-router";
import { RequestLoggerMiddleware } from "../src/middleware";

function printPath(router: any) {
  console.error(`/${router.path}/${router.installedControllers[0].action}`);
}
describe("WebRouter test", () => {
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
  describe("MyFirstWebRouter", () => {
    beforeEach(() => {
      appState = getAppState();

      app = express();
      //      app.use(express.json()); // Middleware to parse JSON
    });
    it("Should throw when router not initialized and attempt to retrieve router", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });

      expect(router.router.bind(router)).toThrow({
        name: "RouterNotInitializedError",
        message: `Router is not defined, did you call initialize on this router?`,
      });
    });

    it("Should return default userName from hello api", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });
      await router.initialize({ appState });
      app.use("/api", router.router()); // Mount the router
      const response = await request(app).get("/api/hello");
      expect(response.body).toEqual({ message: "Hello Jaymoney!" });
    });

    it("Should update userName", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });
      await router.initialize({
        appState,
      });
      app.use("/api/", router.router()); // Mount the router
      printPath(router);

      // TODO: take advantage of supertest chaining methods
      const response = await request(app)
        .post("/api/name")
        .send({ userName: "WannaWatchMeCode" })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({
          message: `Username has been updated from Jaymoney to WannaWatchMeCode`,
        });
      //expect(response.statusCode).toEqual(200);
      //      expect(response.body).toEqual({
      //      message: `Username has been updated from WannaWatchMeCode to Jaymoney`,
      //      });
    });

    it("Should get from hello controller", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });
      await router.initialize({
        appState,
      });
      app.use("/api/", router.router()); // Mount the router
      printPath(router);

      // TODO: take advantage of supertest chaining methods
      const response = await request(app)
        .get("/api/hello")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({ message: "Hello Jaymoney!" });
    });

    it("Should update use global state to show creator and create time", async () => {
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
    });

    it("Should set default path to api", () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });
      expect(router.path).toEqual("api");
    });

    it("Should throw on router already initialized", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
      });

      await router.initialize({ appState });
      try {
        await router.initialize({ appState });
      } catch (e) {
        expect(e).toMatchObject({
          error: "WebRouterAlreadyInitializedException",
          message: "Web router is already initialized",
        });
      }
    });
    it("Should throw on installedControllers exception", async () => {
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
        expect(e).toMatchObject({
          message: "Error initializing router",
        });

        expect(e.stack).toBeDefined();
        expect(e.error).toEqual("ForcedInstallControllersException");
      }
    });

    it("Should throw with included stack on installedControllers throws exception with stack", async () => {
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
        expect(e).toMatchObject({
          message: "Error initializing router",
          error: exception,
          stack: exception.stack,
        });

        expect(e.stack).toBeDefined();
      }
    });

    it("Should return empty state before initialize", () => {
      const router = new NoControllerWebRouter({ logger: routerLogger });
      const state: any = router.getState();
      expect(state).toEqual({});
    });

    it("Should not install non existing controllers", async () => {
      const router: any = new NoControllerWebRouter({
        logger: routerLogger,
      });

      await router.initialize({ appState });
      expect(router.installedControllers.length).toEqual(0);
      expect(router.actualRouter).toBeDefined();
      expect(router.webControllerClasses.length).toEqual(0);
    });

    it("Should throw on router already initialized with not controllers", async () => {
      const router: any = new NoControllerWebRouter({
        logger: routerLogger,
      });

      await router.initialize({ appState });

      try {
        await router.initialize({ appState });
      } catch (e: any) {
        expect(e).toMatchObject({
          error: "WebRouterAlreadyInitializedException",
          message: "Web router is already initialized",
        });
      }
    });

    it("Should maintain state between different controllers", async () => {
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

    it("Should work with installed middleware", async () => {
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
  });
});
