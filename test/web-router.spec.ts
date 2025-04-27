import { WebRouter } from "../src/web-router";
import { MyFirstWebRouter, routerLogger } from "./impls/test-web-router";
import request from "supertest";
// @ts-ignore
import express from "@swizzyweb/express";

describe("WebRouter test", () => {
  let app: any;

  describe("MyFirstWebRouter", () => {
    beforeEach(() => {
      app = express();
      app.use(express.json()); // Middleware to parse JSON
    });
    it("Should throw when router not initialized and attempt to retrieve router", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
        state: { memoryDb: {} },
        appDataPath: ".",
      });

      expect(router.router.bind(router)).toThrow({
        name: "RouterNotInitializedError",
        message: `Router is not defined, did you call initialize on this router?`,
      });
    });

    it("Should return default userName", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
        state: { memoryDb: {} },
        appDataPath: ".",
      });
      await router.initialize({});
      app.use("/api", router.router()); // Mount the router
      const response = await request(app).get("/api/hello");
      expect(response.body).toEqual({ message: "Hello WannaWatchMeCode!" });
    });

    it("Should update userName", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
        state: { memoryDb: {} },
        appDataPath: ".",
      });
      await router.initialize({});
      app.use("/api", router.router()); // Mount the router

      // TODO: take advantage of supertest chaining methods
      const response = await request(app)
        .post("/api/name")
        .send({ userName: "Jaymoney" });
      expect(response.body).toEqual({
        message: `Username has been updated from WannaWatchMeCode to Jaymoney`,
      });
    });

    it("Should update use global state to show creator and create time", async () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
        state: { memoryDb: {} },
        appDataPath: ".",
      });
      const createdAt = Date.now();
      const creatorName = "SwizzyWeb";
      await router.initialize({ globalState: { creatorName, createdAt } });
      app.use("/api", router.router()); // Mount the router

      // TODO: take advantage of supertest chaining methods
      const response = await request(app)
        .get("/api/creator")
        .expect({
          message: `The creator of this app is ${creatorName}`,
          createdAt,
        });
    });
    it("Should set default path to '/webRouter'", () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
        state: { memoryDb: {} },
        appDataPath: ".",
      });
      expect(router.path).toEqual("/webRouter");
    });

    it("Should override path with /myNewPath", () => {
      const router = new MyFirstWebRouter({
        logger: routerLogger,
        state: { memoryDb: {} },
        path: "/myNewPath",
        appDataPath: ".",
      });
      expect(router.path).toEqual("/myNewPath");
    });
  });
});
