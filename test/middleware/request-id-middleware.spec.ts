import { RequestIdMiddleware } from "../../src/middleware";
import { middlewareLogger } from "../impls/router-logger";

describe("RequestId middleware tests", () => {
  it("Should add requestId", (done) => {
    const user: any = {};
    const request: any = {
      user,
      swizzy: {},
    };

    const middleware = RequestIdMiddleware({
      logger: middlewareLogger,
      state: {},
    });
    middleware(request, {}, () => {
      expect(request.swizzy.requestId).toBeDefined();
      done();
    });
  });

  it("Should use existing requestId if already present", (done) => {
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
    middleware(request, {}, () => {
      expect(request.swizzy.requestId).toEqual(requestId);
      done();
    });
  });
});
