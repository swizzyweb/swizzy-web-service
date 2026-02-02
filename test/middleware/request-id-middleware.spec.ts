import expect from "expect";
import { RequestIdMiddleware } from "../../dist/middleware/index.js";
import { middlewareLogger } from "../impls/router-logger.ts";
import test from "node:test";

test("RequestId middleware tests", () => {
  test.it("Should add requestId", (ctx, done) => {
    const user: any = {};
    const request: any = {
      user,
      swizzy: {},
    };

    const middleware = RequestIdMiddleware({
      logger: middlewareLogger,
      state: {},
    });
    middleware(request, {} as any, () => {
      expect(request.swizzy.requestId).toBeDefined();
      done();
    });
  });

  test.it("Should use existing requestId if already present", (ctx, done) => {
    const requestId = crypto.randomUUID();
    const request: any = {
      swizzy: {
        requestId,
      },
    };

    const middleware = RequestIdMiddleware({
      logger: middlewareLogger,
      state: {},
    });
    middleware(request, {} as any, () => {
      expect(request.swizzy.requestId).toEqual(requestId);
      done();
    });
  });
});
