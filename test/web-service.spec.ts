import { describe, expect, test } from "@jest/globals";
import { DummyWebService } from "./dummy-web-service";
import path from "path";
import request from "supertest";
// @ts-ignore
import express from "@swizzyweb/express";
import {
  WebRouterWebService,
  webServiceLogger,
} from "./impls/web-router-web-service";
describe("webservice", () => {
  let app: any;
  beforeEach(() => {
    app = express();
    app.use(express.json()); // Middleware to parse JSON
  });

  test("sets default app directory to root package", () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: undefined,
      serviceArgs: {},
      state: {},
    };

    const webservice: any = new DummyWebService(args);
    expect(webservice.appDataPath).toBe(
      path.resolve(__dirname, "../appdata/@swizzyweb/dummy-web-service"),
    );
  });
  test("sets app directory to specified absolute path", () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: "/tmp/dynserve/",
      serviceArgs: {},
    };

    const webservice: any = new DummyWebService(args);
    expect(webservice.appDataPath).toBe(
      "/tmp/dynserve/appdata/@swizzyweb/dummy-web-service",
    );
  });
  test("sets app directory to specified relative path", () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: "dynserve/",
      serviceArgs: {},
    };

    const webservice: any = new DummyWebService(args);
    expect(webservice.appDataPath).toBe(
      path.join(__dirname, "../dynserve/appdata/@swizzyweb/dummy-web-service"),
    );
  });

  it("Should install express router", () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: undefined,
      serviceArgs: {},
    };

    // const webservice: any = new DummyWebService(args);
  });

  it("Should install WebRouter", async () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app,
    };

    const webservice: any = new WebRouterWebService(args);
    //  try {
    await webservice.install({});
    //    } catch(e) {
    //    console.log(JSON.stringify(e));
    //}
  });

  it("Should throw on install WebRouter when already installed", async () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app,
    };

    const webservice: any = new WebRouterWebService(args);
    await webservice.install({});

    try {
      await webservice.install({});
    } catch (e: any) {
      expect(e.message).toEqual(
        `Service ${WebRouterWebService.name} is already installed`,
      );
      console.log(JSON.stringify(e));
    }
  });

  it("Should uninstall WebRouter", async () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app,
    };

    const webservice: any = new WebRouterWebService(args);
    //  try {
    await webservice.install({});
    await webservice.uninstall({});
    //    } catch(e) {
    //    console.log(JSON.stringify(e));
    //}
  });

  it("Should throw on uninstall when not installed", async () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
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
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app,
    };

    const webservice: any = new WebRouterWebService(args);
    await webservice.install({});
    expect(webservice.isInstalled()).toEqual(true);
  });

  it("Should not be installed before install", async () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      /**
       * attach to existing app managed externally.
       * the web service will not start the listener or specify port for the express app
       * if this is specified. if specified you cannot specify the port parameter.
       */
      //app?: application;
      //port?: number;
      //logger?: ilogger;
      //routers?: router[],
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app,
    };

    const webservice: any = new WebRouterWebService(args);
    expect(webservice.isInstalled()).toEqual(false);
  });
  it("Should not be installed after uninstall", async () => {
    const args = {
      packageName: "@swizzyweb/dummy-web-service",
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app,
    };

    const webservice: any = new WebRouterWebService(args);
    await webservice.install({});
    await webservice.uninstall({});
    expect(webservice.isInstalled()).toEqual(false);
  });

  it("Should call use with router on install", async () => {
    const mockApp = { use: jest.fn() };
    const args = {
      logger: webServiceLogger,
      packageName: "@swizzyweb/dummy-web-service",
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app: mockApp,
    };

    const webservice: any = new WebRouterWebService(args);
    await webservice.install({});
    expect(mockApp.use).toHaveBeenCalledTimes(1);
  });

  it("Should add installed routers to _installedRotuers", async () => {
    const mockApp = { use: jest.fn() };
    const args = {
      logger: webServiceLogger,
      packageName: "@swizzyweb/dummy-web-service",
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app: mockApp,
    };

    const webservice: any = new WebRouterWebService(args);
    await webservice.install({});
    expect(webservice._installedRouters.length).toEqual(1);
  });

  it("Should call unuse with router to uninstall", async () => {
    const mockApp = { use: jest.fn(), unuse: jest.fn() };
    const args = {
      logger: webServiceLogger,
      packageName: "@swizzyweb/dummy-web-service",
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app: mockApp,
    };

    const webservice: any = new WebRouterWebService(args);
    await webservice.install({});
    expect(mockApp.use).toHaveBeenCalledTimes(1);

    await webservice.uninstall({});
    expect(mockApp.unuse).toBeCalledTimes(1);
  });

  it("Should remove router from _installedRouters on uninstall", async () => {
    const mockApp = { use: jest.fn(), unuse: jest.fn() };
    const args = {
      logger: webServiceLogger,
      packageName: "@swizzyweb/dummy-web-service",
      appDataRoot: undefined,
      serviceArgs: {},
      state: {
        createdAt: Date.now(),
        creatorName: "Jaymoney",
      },
      app: mockApp,
    };

    const webservice: any = new WebRouterWebService(args);
    await webservice.install({});
    await webservice.uninstall({});

    expect(webservice._installedRouters.length).toEqual(0);
  });
});
