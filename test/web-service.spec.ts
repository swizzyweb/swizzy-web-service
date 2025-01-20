import { describe, expect, test } from "@jest/globals";
import { DummyWebService } from "./dummy-web-service";
import path from 'path';
import request from 'supertest';
import express from 'express';
import { WebRouterWebService } from './impls/web-router-web-service';
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
    };

    const webservice: any = new DummyWebService(args);
    expect(webservice.appDataPath).toBe(
      path.resolve(__dirname, "../appdata/@swizzyweb/dummy-web-service")
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
      path.join(__dirname, "../dynserve/appdata/@swizzyweb/dummy-web-service")
    );
  });

  it('Should install express router', () => {
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

  it('Should install WebRouter', async () => {
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
        creatorName: 'Jaymoney'
      },
      app,
    };

    const webservice: any = new WebRouterWebService(args);
//  try {
    await webservice.install({});
//    } catch(e) {
  //    console.log(JSON.stringify(e));
    //}
  })
  
});
