import { SwizzyWebRouterClass } from "../src/router/web-router";
import { WebService } from "../src/service/web-service";
import {
  IMyFirstWebRouterState,
  MyFirstWebRouter,
} from "./impls/test-web-router";

export class DummyWebService extends WebService<any> {
  readonly name: string = "DummyWebService";
  constructor(props: any) {
    super({
      ...props,
      routerClasses: [MyFirstWebRouter],
      middleware: [],
    });
  }
}
