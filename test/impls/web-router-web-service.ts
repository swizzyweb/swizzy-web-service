import {
  RequestIdMiddleware,
  RequestLoggerMiddleware,
  SwizzyRequestMiddleware,
} from "../../dist/middleware/index.js";
import { WebService } from "../../dist/service/index.js";
//import { IWebServiceProps } from "../../dist/service/index.js";
import { MyFirstWebRouter } from "./test-web-router.ts";
type IWebServiceProps<T> = any;
type IWebRouterWebServiceProps = any;

export class WebRouterWebService extends WebService<any> {
  constructor(props: IWebRouterWebServiceProps) {
    super({
      name: "WebRouterWebService",
      packageName: "@my-namespace/web-router-web-service",
      ...props,
      routerClasses: [MyFirstWebRouter],
      path: "webservice",
      port: props.port ?? 3000,
      middleware: [
        SwizzyRequestMiddleware,
        RequestIdMiddleware,
        RequestLoggerMiddleware,
      ],
    });
  }
}
