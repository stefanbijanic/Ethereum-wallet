import { Application } from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import UserController from "./controller";

class UserRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {
        const userController = new UserController(resources);

        application.get(
            "/user", 
            // AuthMiddleware.getVerifier("administrator"), 
            userController.getAll.bind(userController)
        );
        application.get(
            "/user/:username", 
            // AuthMiddleware.getVerifier("administrator", "user"), 
            userController.getByUsername.bind(userController)
        );
        application.get(
            "/user/user-id/:id", 
            // AuthMiddleware.getVerifier("administrator", "user"), 
            userController.getById.bind(userController)
        );
        application.post(
            "/user", 
            userController.add.bind(userController)
        );
        application.put(
            "/user/:id", 
            // AuthMiddleware.getVerifier("user"), 
            userController.edit.bind(userController)
        );
    }
}

export default UserRouter;