import { SwizzyWebRouterClass } from "../dist/router/web-router.js";
import { WebService } from "../dist/service/web-service.js";
import {
  IMyFirstWebRouterState,
  MyFirstWebRouter,
} from "./impls/test-web-router.js";

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
