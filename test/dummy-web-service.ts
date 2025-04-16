import { SwizzyWebRouterClass } from "../src/web-router";
import { WebService } from "../src/web-service";
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
    });
  }
}
