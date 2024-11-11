import { WebService } from "../src/web-service";

export class DummyWebService extends WebService {
  readonly name: string = "DummyWebService";
  constructor(props: any) {
    super(props);
  }
}
