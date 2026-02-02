//import { describe, expect, test } from "@mock/globals";
//import { WebRouterWebService } from "./impls/web-router-web-service";
import expect from "expect";
import path from "path";
import request from "supertest";
import express from "express";
import {
  //  IWebRouterWebServiceProps,
  WebRouterWebService,
} from "./impls/web-router-web-service.ts";
import { webServiceLogger } from "./impls/router-logger.ts";
import test, { mock } from "node:test";
import assert from "node:assert";
import { setTimeout } from "node:timers/promises";

type IWebRouterWebServiceProps = any;

const logger = webServiceLogger;
const port = 3000;
const state: any = {
  memoryDb: {},
  currentUserName: "Jaymoney",
  creatorName: "Jaymoney",
  createdAt: Date.now(),
};

let app: any;
let args: IWebRouterWebServiceProps;
test.beforeEach(() => {
  app = express();
  args = {
    app,
    logger,
    port,
    state,
  };
});

test.it("Should install express router", () => {
  const webservice: any = new WebRouterWebService(args);
});

test.it("Should install WebRouter", async () => {
  const webservice: any = new WebRouterWebService(args);
  await webservice.install({});
});

test.it(
  "Should throw on install WebRouter when already installed",
  async () => {
    const webservice: any = new WebRouterWebService(args);
    await webservice.install({});

    try {
      await webservice.install({});
    } catch (e: any) {
      expect(e.message).toEqual(
        `Service ${WebRouterWebService.name} is already installed`,
      );
    }
  },
);

test.it("Should uninstall WebRouter", async () => {
  const webservice: any = new WebRouterWebService(args);
  await webservice.install({});
  await webservice.uninstall({});
});

test.it("Should throw on uninstall when not installed", async () => {
  const webservice: any = new WebRouterWebService(args);
  try {
    await webservice.uninstall({});
  } catch (e: any) {
    expect(e.message).toEqual(
      `Failed to uninstall non installed service ${webservice.name}`,
    );
  }
});

test.it("Should return installed after installed", async () => {
  const webservice: any = new WebRouterWebService(args);
  await webservice.install({});
  expect(webservice.isInstalled()).toEqual(true);
});

test.it("Should not be installed before install", async () => {
  const webservice: any = new WebRouterWebService(args);
  expect(webservice.isInstalled()).toEqual(false);
});

test.it("Should not be installed after uninstall", async () => {
  const webservice: any = new WebRouterWebService(args);
  await webservice.install({});
  await webservice.uninstall({});
  expect(webservice.isInstalled()).toEqual(false);
});

test.it("Should call use with router on install", async () => {
  const mockApp = { use: mock.fn() };
  const useSpy = mock.method(mockApp, "use");
  const newArgs = {
    ...args,
    app: mockApp,
  };

  const webservice: any = new WebRouterWebService(newArgs);
  await webservice.install({});
  assert.strictEqual(mockApp.use.mock.calls.length, 1);
});

test.it("Should add installed routers to installedRotuers", async () => {
  const mockApp = { use: mock.fn() };
  const newArgs = {
    ...args,
    app: mockApp,
  };

  const webservice: any = new WebRouterWebService(newArgs);
  await webservice.install({});
  assert.strictEqual(mockApp.use.mock.calls.length, 1);
});

test.it("Should call unuse with router to uninstall", async () => {
  const mockApp: any = express();
  const newArgs = {
    ...args,
    app: mockApp,
  };

  const webservice: any = new WebRouterWebService(newArgs);
  expect(mockApp.router.stack.length).toBe(0);
  await webservice.install({});
  expect(webservice.installedRouters.length).toBe(1);
  expect(mockApp.router.stack.length).toBe(4);
  await webservice.uninstall({});
  expect(webservice.installedRouters.length).toBe(0);
  expect(mockApp.router.stack.length).toBe(0);
});

test.it("Should remove router from installedRouters on uninstall", async () => {
  const mockApp = express();
  const newArgs = {
    ...args,
    app: mockApp,
  };

  const webservice: any = new WebRouterWebService(newArgs);

  await webservice.install({});
  await webservice.uninstall({});

  expect(webservice.installedRouters.length).toEqual(0);
});

test.it("Should throw on fail install routers", async () => {
  const service = new WebRouterWebService({
    ...args,
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

test.it("Should throw on fail uninstall routers", async () => {
  const service = new WebRouterWebService({
    ...args,
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

test.it("Should maintain state between controllers", async () => {
  const webService = new WebRouterWebService(args);

  await webService.install({});

  const firstHelloResponse = await request(app)
    .get("/webservice/api/hello")
    //        .expect("Content-Type", /json/)
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

test.it("Should toString without failing", async () => {
  const webService = new WebRouterWebService(args);

  await webService.install({});
  webService.toString();
  expect(webService.toString()).toEqual(
    `{"service":{"name":"WebRouterWebService","instanceId":"${webService.instanceId}","isInstalled":true,"port":3000,"packageName":"@my-namespace/web-router-web-service","path":"webservice","installedRouters":[{"name":"MyFirstWebRouter","webControllerClasses":[null,null,null],"installedControllers":[{"name":"NameController","action":"name","method":"post","middleware":[{"name":"json"}],"stateConverter":{"name":"DefaultStateExporter"}},{"name":"HelloController","action":"hello","method":"get","middleware":[],"stateConverter":{"name":"DefaultStateExporter"}},{"name":"CreatorController","action":"creator","method":"get","middleware":[{"name":"json"}],"stateConverter":{"name":"DefaultStateExporter"}}],"path":"api","middleware":[],"stateConverter":{"name":"DefaultStateExporter"}}],"middleware":[{"name":"SwizzyRequestMiddlewareFunction"},{"name":"RequestIdMiddleware"},{"name":"RequestLoggerMiddleware"}]}}`,
  );
});
