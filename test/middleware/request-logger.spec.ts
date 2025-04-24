import { BrowserLogger, ILogger } from "@swizzyweb/swizzy-common";
// @ts-ignore
import express, { Request, Response, Router } from "@swizzyweb/express";
import { info, log } from "node:console";
import { RequestLoggerMiddleware } from "../../src/middleware/request-logger-middleware";
import request from "supertest";

describe("RequestLoggerMiddleware tests", () => {
  it("Should log the request on successful get", async () => {
    const logger: ILogger<any> = {
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      getLoggerProps: jest.fn(),
      clone: jest.fn(),
    };
    const infoSpy = jest.spyOn(logger, "info").mockImplementation();
    const warnSpy = jest.spyOn(logger, "warn").mockImplementation();
    const uuid = crypto.randomUUID();
    const uuidMock = jest
      .spyOn(crypto, "randomUUID")
      .mockImplementation(() => uuid);
    const router = Router();
    router.use(RequestLoggerMiddleware({ logger, state: {} }));
    router.use(express.json());
    router.get("/home", (req: Request, res: Response) => {
      res.send({ value: "Hello" });
    });
    const app = express();
    app.use("/home", router);
    const res = await request(app).get("/home/home");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ value: "Hello" });
    expect(infoSpy).toHaveBeenCalledWith(
      `[${uuid}]: GET /home/home ::ffff:127.0.0.1`,
    );
    expect(infoSpy).toHaveBeenCalledWith(
      `[${uuid}]: GET /home/home ::ffff:127.0.0.1 200`,
    );
  });

  it("Should warn on no logger provided and do nothing", async () => {
    const logger: ILogger<any> = {
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      getLoggerProps: jest.fn(),
      clone: jest.fn(),
    };
    const consoleSpy = jest.spyOn(console, "warn");
    const infoSpy = jest.spyOn(logger, "info").mockImplementation();
    const warnSpy = jest.spyOn(logger, "warn").mockImplementation((val) => {});
    const uuid = crypto.randomUUID();
    const uuidMock = jest
      .spyOn(crypto, "randomUUID")
      .mockImplementation(() => uuid);
    const router = Router();
    const props: any = {};
    router.use(RequestLoggerMiddleware({ ...props }));
    router.use(express.json());
    router.get("/home", (req: Request, res: Response) => {
      res.send({ value: "Hello" });
    });
    const app = express();
    app.use("/home", router);
    const res = await request(app).get("/home/home");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ value: "Hello" });
    expect(consoleSpy).toHaveBeenCalledWith(
      `WARN!!!!: Logger not provided for RequestLoggerMiddleware, middleware will be a no-op, this will only display once per usage...`,
    );
    expect(infoSpy).not.toHaveBeenCalled();
  });
});
