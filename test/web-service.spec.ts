import { describe, expect, test } from "@jest/globals";
import { DummyWebService } from "./dummy-web-service";

describe("webservice", () => {
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
      appDataRootPath: undefined,
      serviceArgs: {},
    };

    const webservice: any = new DummyWebService(args);
    expect(webservice.appDataPath).toBe(
      "/home/jmoney/repos/BrowserToolkitWorkspace/SwizzyWebService/appdata/@swizzyweb/dummy-web-service",
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
      appDataRootPath: "/tmp/dynserve/",
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
      appDataRootPath: "dynserve/",
      serviceArgs: {},
    };

    const webservice: any = new DummyWebService(args);
    expect(webservice.appDataPath).toBe(
      "/home/jmoney/repos/BrowserToolkitWorkspace/SwizzyWebService/dynserve/appdata/@swizzyweb/dummy-web-service",
    );
  });

  
});
