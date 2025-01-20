import { WebService } from '../../src/web-service';
import { IWebServiceProps } from '../../src/web-service-props'
import { MyFirstWebRouter } from './test-web-router';
export interface IWebRouterWebServiceProps extends IWebServiceProps {
  
}

export class WebRouterWebService extends WebService {
  readonly name: string = "WebRouterWebService";

  constructor(props: IWebRouterWebServiceProps) {
    super({...props,
      routers: [
        new MyFirstWebRouter({state: {memoryDb: {}}})
    ]});
  }
}


