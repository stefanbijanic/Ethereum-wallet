import * as express from "express";
import AuthController from './controller';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';

export default class AuthRouter implements IRouter {
    public setupRoutes(application: express.Application, resources: IApplicationResources) {
        const authController: AuthController = new AuthController(resources);

        application.post("/user/login", authController.userLogin.bind(authController));
        application.post("/administrator/login", authController.administratorLogin.bind(authController));

        application.post("/user/refresh", authController.userRefresh.bind(authController));
        application.post("/administrator/refresh", authController.administratorRefresh.bind(authController));
    }
}
