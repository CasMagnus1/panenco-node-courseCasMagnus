// src/app.js
import express from 'express';
import { UserRoute } from './controllers/users/user.route';
import {Request, Response, NextFunction, Application} from 'express';
type Error = {"details": string}

export class App {
  host: Application;

  constructor() {
    // Init server
    this.host = express();
    this.host.use(express.json());
    this.host.use((req, res, next) => {
        console.log(req.method, req.url);
        next();
    })
    const userRouter = new UserRoute();
    this.host.use(`/api/${userRouter.path}`, userRouter.router);
    this.host.use((req, res, next) => {
        res.status(404);
        res.json({"details":"page not found"});
    })
    this.host.use((error: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(400);
        res.json(error);
    })
  }

  listen() {
    this.host.listen(3000, () => {
      console.info(`🚀 http://localhost:3000`);
      console.info(`========================`);
    });
  }
}