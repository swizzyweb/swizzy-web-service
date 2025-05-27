import { WebService } from "../../src/service";
import { IWebServiceProps } from "../../src/service";
import { MyFirstWebRouter } from "./test-web-router";

export interface IWebRouterWebServiceProps extends IWebServiceProps<any> {}

export class WebRouterWebService extends WebService<any> {
  constructor(props: IWebRouterWebServiceProps) {
    super({
      name: "WebRouterWebService",
      packageName: "@my-namespace/web-router-web-service",
      ...props,
      routerClasses: [MyFirstWebRouter],
      path: "webservice",
      port: props.port ?? 3000,
      middleware: [],
    });
  }
}
