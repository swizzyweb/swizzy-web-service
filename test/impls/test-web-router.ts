import { WebRouter, IWebRouterProps, IWebRouterInitProps } from '../../src/web-router';
import express, {Request, Response} from 'express';


export interface IMyFirstWebRouterState {
  memoryDb: any;
  currentUserName?: string;
}

export interface IMyFirstWebRouterProps extends IWebRouterProps<IMyFirstWebRouterState> {
}

export interface IMyFirstWebServiceInitProps extends IWebRouterInitProps<any> {

}

export class MyFirstWebRouter extends WebRouter<IMyFirstWebRouterState, any> {
  constructor(props: IMyFirstWebRouterProps) {
    super({...props,
    state: {
        ...props.state, 
        currentUserName: 'WannaWatchMeCode'
        }
      });

  }

  async initialize(props: IMyFirstWebServiceInitProps): Promise<void> {
    await super.initialize(props);
    const router = express.Router();
    const state = this.state;
    router.get('/hello', (req: Request, res: Response) => {
      //res.contentType('text/plain')
      res.send({message: `Hello ${state.currentUserName}!`});
    });

    router.post('/name', (req: Request, res: Response) => {
      const oldUserName = state.currentUserName;
      state.currentUserName = req.body.userName;
      res.send({message:`Username has been updated from ${oldUserName} to ${state.currentUserName}`});
    });

    router.get('/creator', (req: Request, res: Response) => {
      res.send({message: `The creator of this app is ${this.globalState.creatorName}`,
        createdAt: this.globalState.createdAt});
    });

    this.actualRouter = router;
  }


}
