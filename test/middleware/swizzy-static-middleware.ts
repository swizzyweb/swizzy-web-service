import expect from "expect";
import { SwizzyStatic } from "../../dist/middleware/swizzy-static-middleware";
import { middlewareLogger } from "../impls/router-logger.ts";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { readFileSync } from "node:fs";
import express from "express";
import { BrowserLogger } from "@swizzyweb/swizzy-common";
import request from "supertest";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test("SwizzyStatic tests", () => {
  test.it(
    "SwizzyStatic should return middleware that hosts static assets",
    async () => {
      const logger = new BrowserLogger({});
      const middleware = SwizzyStatic({ staticAssetsPath: __dirname });
      const file = "request-id-middleware.ts";
      const fileContent = readFileSync(path.join(__dirname, file), {
        encoding: "utf8",
      });
      const app = express();
      app.use(middleware({ state: {}, logger })); //("/" + action, middleware, controller);
      const response = await request(app)
        .get("/request-id-middleware.ts")
        .send()
        .expect("body", fileContent);
    },
  );
});
