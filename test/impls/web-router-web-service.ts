import { SwizzyWinstonLogger } from "../../src/util/logger";
import { SwizzyWebRouterClass } from "../../src/web-router";
import { WebService } from "../../src/web-service";
import { IWebServiceProps } from "../../src/web-service-props";
import { MyFirstWebRouter } from "./test-web-router";
export interface IWebRouterWebServiceProps extends IWebServiceProps<any> {}

const loggerProps = { hostName: "hostName", appName: "appName", port: 3000 };
export const webServiceLogger = new SwizzyWinstonLogger(loggerProps);

export class WebRouterWebService extends WebService<any> {
  readonly name: string = "WebRouterWebService";

  constructor(props: IWebRouterWebServiceProps) {
    super({
      ...props,
      /*      routers: [
        new MyFirstWebRouter({
          state: { memoryDb: {} },
          logger: webServiceLogger,
        }),
      ],*/
      routerClasses: [MyFirstWebRouter],
    });
  }
}
