// Import the module or component to test
import { WebRouter } from '../src/web-router';
import { MyFirstWebRouter } from './impls/test-web-router';
import request from 'supertest';
import express from 'express';
// Describe the test suite
describe('WebRouter test', () => {
  let app: any;


  // Example of a unit test for a function
  describe('MyFirstWebRouter', () => {

  beforeEach(() => {
    app = express();
    app.use(express.json()); // Middleware to parse JSON
  });
    it('Should throw when router not initialized and attempt to retrieve router', async () => {
      const router = new MyFirstWebRouter({state: {memoryDb: {}}})      

    expect(router.router.bind(router)).toThrow({name: 'RouterNotInitializedError', message: `Router is not defined, did you call initialize on this router?`});
      
    });

    it('Should return default userName', async () => {
      const router = new MyFirstWebRouter({state: {memoryDb: {}}})      
      await router.initialize({});
    app.use('/api', router.router()); // Mount the router
    const response = await request(app).get('/api/hello');
      expect(response.body).toEqual({message: 'Hello WannaWatchMeCode!'});
    });

     it('Should update userName', async () => {
      const router = new MyFirstWebRouter({state: {memoryDb: {}}})      
      await router.initialize({});
    app.use('/api', router.router()); // Mount the router

      // TODO: take advantage of supertest chaining methods
    const response = await request(app).post('/api/name').send({userName: 'Jaymoney'});
      expect(response.body).toEqual({message:`Username has been updated from WannaWatchMeCode to Jaymoney`});
    });

     it('Should update use global state to show creator and create time', async () => {
      const router = new MyFirstWebRouter({state: {memoryDb: {}}})
      const createdAt = Date.now();
      const creatorName = 'SwizzyWeb';
      await router.initialize({globalState: {creatorName, createdAt}});
    app.use('/api', router.router()); // Mount the router

      // TODO: take advantage of supertest chaining methods
    const response = await request(app).get('/api/creator')
      .expect({message: `The creator of this app is ${creatorName}`,
        createdAt});
    });
  });
});
