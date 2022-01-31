import { Application } from "express";
import IApplicationResources from "../../common/IApplicationResources.interface";
import IRouter from "../../common/IRouter.interface";
import AuthMiddleware from "../../middleware/auth.middleware";
import WalletController from "./controller";

class WalletRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {
        const walletController = new WalletController(resources);

        application.get(
            "/wallet", 
            // AuthMiddleware.getVerifier("administrator"), 
            walletController.getAll.bind(walletController)
        );
        application.get(
            "/wallet/user/:uid", 
            // AuthMiddleware.getVerifier("administrator", "user"), 
            walletController.getAllByUserId.bind(walletController)
        );
        application.get(
            "/wallet/address/:publicAddress", 
            // AuthMiddleware.getVerifier("administrator", "user"), 
            walletController.getByPublicAddress.bind(walletController)
        );
        application.get(
            "/wallet/:id", 
            // AuthMiddleware.getVerifier("administrator", "user"), 
            walletController.getById.bind(walletController)
        );

        application.post(
            "/wallet/user/:uid", 
            // AuthMiddleware.getVerifier("user"), 
            walletController.createWallet.bind(walletController)
        );

        application.put(
            "/wallet/:id", 
            // AuthMiddleware.getVerifier("user"), 
            walletController.edit.bind(walletController)
        );

        application.get(
            "/wallet/update/:publicAddress", 
            // AuthMiddleware.getVerifier("user"), 
            walletController.updateBalance.bind(walletController)
        );
        application.post(
            "/wallet/send/user/:uid", 
            // AuthMiddleware.getVerifier("user"), 
            walletController.send.bind(walletController)
        );
        application.get(
            "/wallet/history/:publicAddress", 
            // AuthMiddleware.getVerifier("administrator", "user"), 
            walletController.history.bind(walletController)
        );
    }
}

export default WalletRouter;