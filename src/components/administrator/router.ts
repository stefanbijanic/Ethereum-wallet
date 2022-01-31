import { Application } from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import AdministratorController from "./controller";

class AdministratorRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {
        const administratorController = new AdministratorController(resources);

        application.get(
            "/administrator", 
            // AuthMiddleware.getVerifier("administrator"), 
            administratorController.getAll.bind(administratorController)
        );
        application.get(
            "/administrator/:username", 
            // AuthMiddleware.getVerifier("administrator"), 
            administratorController.getByUsername.bind(administratorController)
        );
        application.get(
            "/administrator/administrator-id/:id",
            // AuthMiddleware.getVerifier("administrator"), 
            administratorController.getById.bind(administratorController)
        );
        application.post(
            "/administrator", 
            // AuthMiddleware.getVerifier("administrator"), 
            administratorController.add.bind(administratorController)
        );
        application.put(
            "/administrator/:id", 
            // AuthMiddleware.getVerifier("administrator"), 
            administratorController.edit.bind(administratorController)
        );
    }
}

export default AdministratorRouter;