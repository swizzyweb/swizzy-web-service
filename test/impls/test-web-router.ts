import { SwizzyWinstonLogger } from "../../src/util/logger";
import {
  WebRouter,
  IWebRouterProps,
  IWebRouterInitProps,
} from "../../src/web-router";
// @ts-ignore
import express /*, { Request, Response, Router }*/ from "@swizzyweb/express";

const loggerProps = { hostName: "hostName", appName: "appName", port: 3000 };
export const routerLogger = new SwizzyWinstonLogger(loggerProps);

export interface IMyFirstWebRouterState {
  memoryDb: any;
  currentUserName?: string;
}

export interface IMyFirstWebRouterProps
  extends IWebRouterProps<IMyFirstWebRouterState> {}

export interface IMyFirstWebServiceInitProps extends IWebRouterInitProps<any> {}

export class MyFirstWebRouter extends WebRouter<any, IMyFirstWebRouterState> {
  constructor(props: IMyFirstWebRouterProps) {
    super({
      ...props,
      state: {
        ...props.state,
        currentUserName: "WannaWatchMeCode",
      },
      path: props.path ?? "/webRouter",
    });
  }

  async getInitializedRouter(
    props: IMyFirstWebServiceInitProps,
  ): Promise<express.Router> {
    const router = await super.getInitializedRouter(props);
    const state = this.getState();
    router.get("/hello", (req: express.Request, res: express.Response) => {
      //res.contentType('text/plain')
      res.send({ message: `Hello ${state.currentUserName}!` });
    });

    router.post("/name", (req: express.Request, res: express.Response) => {
      const oldUserName = state.currentUserName;
      state.currentUserName = req.body.userName;
      res.send({
        message: `Username has been updated from ${oldUserName} to ${state.currentUserName}`,
      });
    });

    router.get("/creator", (req: express.Request, res: express.Response) => {
      res.send({
        message: `The creator of this app is ${this.globalState.creatorName}`,
        createdAt: this.globalState.createdAt,
      });
    });
    return Promise.resolve(router);
  }
}
