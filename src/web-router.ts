import { Router } from 'express';

// See if router is a class?
export interface IWebRouter<STATE, GLOBAL_STATE> {
  initialize(props: IWebRouterInitProps<GLOBAL_STATE>): Promise<void>;
  router(): any;//Router;
  getState(): STATE;
  /**
   * Not sure if we should strongly type key / values
   */
  //setStateParam(key: any, value: any): Promise<void>;
}

export interface IWebRouterProps<STATE> {
  state: STATE;
}

export interface IWebRouterInitProps<GLOBAL_STATE> {
  globalState?: GLOBAL_STATE
}
  


// Thinking...
export abstract class WebRouter<STATE, GLOBAL_STATE> implements IWebRouter<STATE, GLOBAL_STATE> {
  /**
  * Configured in initialize.
  */
  actualRouter?: Router;
  state: STATE;
  globalState?: GLOBAL_STATE
  constructor(props: IWebRouterProps<STATE>) {
     this.state = props.state;
//     this.router.bind(this);
  }

  // Should we inject state here instead?
  // Then we can init it in the web service?
  // Let's have two states, global and this inner state.
  // Feel free to overide
  async initialize(props: IWebRouterInitProps<GLOBAL_STATE>): Promise<void> {
    this.globalState = props.globalState;
  }

  router(): Router {
//    this.router.bind(this);
    console.log(this);
    console.log(this.actualRouter);
    if (this.actualRouter) {

      return this.actualRouter;
    } else {
      throw {name: 'RouterNotInitializedError', message: `Router is not defined, did you call initialize on this router?`};
    }


  }
  
  /*setStateParam(key: any, value: any): Promise<void> {
    this.state[key] = value;
  }*/

  getState(): STATE {
    return this.state;
  }
  
}
