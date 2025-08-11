import expect from "expect";
//import { BrowserLogger, ILogger } from "@swizzyweb/swizzy-common";
// @ts-ignore
import express from "@swizzyweb/express"; //, { Request, Response, Router }
import { info, log } from "node:console";
import { RequestLoggerMiddleware } from "../../dist/middleware/request-logger-middleware.js";
import request from "supertest";
import test, { mock } from "node:test";
import assert from "node:assert";
type ILogger<T> = any;

test("RequestLoggerMiddleware tests", () => {
  test.it("Should log the request on successful get", async () => {
    const logger: ILogger<any> = {
      log(d: any) {},
      info(d: any) {},
      error(d: any) {},
      debug(d: any) {},
      warn(d: any) {},
      //      getLoggerProps: mock.fn(),
      clone() {},
    };
    const infoSpy = mock.method(logger, "info", (d: any) => {});
    const warnSpy = mock.method(logger, "warn", (d: any) => {});
    const uuid = crypto.randomUUID();
    const uuidMock = mock.method(crypto, "randomUUID", () => uuid);
    const router = express.Router();
    router.use(RequestLoggerMiddleware({ logger, state: {} }));
    router.use(express.json());
    router.get("/home", (req: express.Request, res: express.Response) => {
      res.send({ value: "Hello" });
    });
    const app = express();
    app.use("/home", router);
    const res = await request(app).get("/home/home");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ value: "Hello" });
    assert.deepStrictEqual(infoSpy.mock.calls[0].arguments, [
      `[req-${uuid}]: GET /home/home ::ffff:127.0.0.1`,
    ]);
    assert.deepStrictEqual(infoSpy.mock.calls[1].arguments, [
      `[res-${uuid}]: GET /home/home ::ffff:127.0.0.1 200`,
    ]);
  });

  test.it("Should warn on no logger provided and do nothing", async () => {
    // const logger: ILogger<any>;
    //    const consoleSpy = mock.method(console, "warn");
    const infoSpy = mock.method(console, "info", (val: any) => {});
    const warnSpy = mock.method(console, "warn", (val: any) => {});
    const uuid = crypto.randomUUID();
    const uuidMock = mock.method(crypto, "randomUUID", () => uuid);
    const router = express.Router();
    const props: any = {};
    router.use(RequestLoggerMiddleware({ ...props }));
    router.use(express.json());
    router.get("/home", (req: express.Request, res: express.Response) => {
      res.send({ value: "Hello" });
    });
    const app = express();
    app.use("/home", router);
    const res = await request(app).get("/home/home");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ value: "Hello" });
    assert.strictEqual(warnSpy.mock.calls.length, 1);
    assert.deepStrictEqual(warnSpy.mock.calls[0].arguments, [
      `WARN!!!!: Logger not provided for RequestLoggerMiddleware, middleware will be a no-op, this will only display once per usage...`,
    ]);
    assert.strictEqual(infoSpy.mock.callCount(), 0);
  });
});
