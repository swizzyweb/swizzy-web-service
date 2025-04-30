import { describe, expect, test } from "@jest/globals";
//import { WebRouterWebService } from "./impls/web-router-web-service";
import path from "path";
import request from "supertest";
// @ts-ignore
import express from "@swizzyweb/express";
import { WebRouterWebService } from "./impls/web-router-web-service";
import { webServiceLogger } from "./impls/router-logger";
describe("Webservice tests", () => {
  describe("Integration tests", () => {
    const state: any = {
      memoryDb: {},
      currentUserName: "Jaymoney",
      creatorName: "Jaymoney",
      createdAt: Date.now(),
    };
    let app: any;
    beforeEach(() => {
      app = express();
      //app.use(express.json()); // Middleware to parse JSON
    });

    it("Should install express router", () => {
      const args = {
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        logger: webServiceLogger,
      };

      // const webservice: any = new WebRouterWebService(args);
    });

    it("Should install WebRouter", async () => {
      const args = {
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        app,
        logger: webServiceLogger,
      };

      const webservice: any = new WebRouterWebService(args);
      await webservice.install({});
    });

    it("Should throw on install WebRouter when already installed", async () => {
      const args = {
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        app,
        logger: webServiceLogger,
      };

      const webservice: any = new WebRouterWebService(args);
      await webservice.install({});

      try {
        await webservice.install({});
      } catch (e: any) {
        expect(e.message).toEqual(
          `Service ${WebRouterWebService.name} is already installed`,
        );
      }
    });

    it("Should uninstall WebRouter", async () => {
      const args = {
        packageName: "@swizzyweb/dummy-web-service",
        state,
        app,
        logger: webServiceLogger,
      };

      const webservice: any = new WebRouterWebService(args);
      await webservice.install({});
      await webservice.uninstall({});
    });

    it("Should throw on uninstall when not installed", async () => {
      const args = {
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        logger: webServiceLogger,
        app,
      };

      const webservice: any = new WebRouterWebService(args);
      try {
        await webservice.uninstall({});
      } catch (e: any) {
        expect(e.message).toEqual(
          `Failed to uninstall non installed service ${webservice.name}`,
        );
      }
    });

    it("Should return installed after installed", async () => {
      const args = {
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        app,
        logger: webServiceLogger,
      };

      const webservice: any = new WebRouterWebService(args);
      await webservice.install({});
      expect(webservice.isInstalled()).toEqual(true);
    });

    it("Should not be installed before install", async () => {
      const args = {
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        app,
        logger: webServiceLogger,
      };

      const webservice: any = new WebRouterWebService(args);
      expect(webservice.isInstalled()).toEqual(false);
    });

    it("Should not be installed after uninstall", async () => {
      const args = {
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        app,
        logger: webServiceLogger,
      };

      const webservice: any = new WebRouterWebService(args);
      await webservice.install({});
      await webservice.uninstall({});
      expect(webservice.isInstalled()).toEqual(false);
    });

    it("Should call use with router on install", async () => {
      const mockApp = { use: jest.fn() };
      const useSpy = jest.spyOn(mockApp, "use");
      const args = {
        logger: webServiceLogger,
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        app: mockApp,
      };

      const webservice: any = new WebRouterWebService(args);
      await webservice.install({});
      expect(useSpy).toHaveBeenCalledTimes(1);
    });

    it("Should add installed routers to installedRotuers", async () => {
      const mockApp = { use: jest.fn() };
      const args = {
        logger: webServiceLogger,
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        app: mockApp,
      };

      const webservice: any = new WebRouterWebService(args);
      await webservice.install({});
      expect(webservice.installedRouters.length).toEqual(1);
    });

    it("Should call unuse with router to uninstall", async () => {
      const mockApp = { use: jest.fn(), unuse: jest.fn() };
      const args = {
        logger: webServiceLogger,
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        app: mockApp,
      };

      const webservice: any = new WebRouterWebService(args);
      await webservice.install({});
      expect(mockApp.use).toHaveBeenCalledTimes(1);

      await webservice.uninstall({});
      expect(mockApp.unuse).toBeCalledTimes(1);
    });

    it("Should remove router from installedRouters on uninstall", async () => {
      const mockApp = { use: jest.fn(), unuse: jest.fn() };
      const args = {
        logger: webServiceLogger,
        packageName: "@swizzyweb/dummy-web-service",
        appDataRoot: undefined,
        serviceArgs: {},
        state,
        app: mockApp,
      };

      const webservice: any = new WebRouterWebService(args);
      await webservice.install({});
      await webservice.uninstall({});

      expect(webservice.installedRouters.length).toEqual(0);
    });

    it("Should throw on fail install routers", async () => {
      const service = new WebRouterWebService({
        app,
        state,
        logger: webServiceLogger,
      });

      // @ts-ignore
      service.installRouters = () => {
        throw "forced exception";
      };

      try {
        await service.install({});
      } catch (e: any) {
        expect(e).toMatchObject({
          message: `WebService ${service.name} failed to install`,
        });
        expect(e.error).toEqual("forced exception");
      }
    });

    it("Should throw on fail uninstall routers", async () => {
      const service = new WebRouterWebService({
        app,
        state,
        logger: webServiceLogger,
      });

      // @ts-ignore
      service.uninstallRouters = () => {
        throw "forced exception";
      };

      try {
        await service.uninstall({});
      } catch (e: any) {
        expect(e).toMatchObject({
          message: `WebService ${service.name} failed to uninstall`,
        });

        expect(e.error).toEqual("forced exception");
      }
    });

    //it ("Should change the name using name controller and check with hello controller", async () => {

    //});
  });

  describe("Integration tests", () => {
    it("Should maintain state between controllers", async () => {
      const state = {
        memoryDb: {},
        creatorName: "creatorName",
        createdAt: Date.now(),
        currentUserName: "Jaymoney",
      };

      const app = express();
      const webService = new WebRouterWebService({
        logger: webServiceLogger,
        app,
        state,
      });

      await webService.install({});

      const firstHelloResponse = await request(app)
        .get("/webservice/api/hello")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({ message: "Hello Jaymoney!" });

      const setNameResponse = await request(app)
        .post("/webservice/api/name")
        .send({ userName: "WannaWatchMeCode" })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({
          message: `Username has been updated from Jaymoney to WannaWatchMeCode`,
        });
      const secondHelloResponse = await request(app)
        .get("/webservice/api/hello")
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({ message: "Hello WannaWatchMeCode!" });

      const secondSetNameResponse = await request(app)
        .post("/webservice/api/name")
        .send({ userName: "AnadaOne" })
        .expect("Content-Type", /json/)
        .expect(200)
        .expect({
          message: `Username has been updated from WannaWatchMeCode to AnadaOne`,
        });
    });
  });
});
