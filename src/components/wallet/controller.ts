import {Request, Response, NextFunction} from "express";
import BaseController from "../../common/BaseController";
import { IAddWallet, IAddWalletVerificator } from "./dto/IAddWallet";
import { IEditWallet, IEditWalletVerificator } from "./dto/IEdditWallet";
const Web3 = require("web3");

class WalletController extends BaseController {
    web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/" + process.env.ROPSTEN_API_KEY));
    // test
    getByPublicAddress1 = async(req: Request, res: Response) => {
        const publicAddress = "0xa9343b118be06df5c20d195ae203d4b8eec5f1d2"
        try {
            const balance = await this.web3.eth.getBalance(publicAddress);
            let ethBalance = this.web3.utils.fromWei(balance, 'ether');
            console.log(balance);
            console.log(ethBalance);
    
            res.send(ethBalance)
        } catch (error) {
            console.log(error)
            res.json({ message: error });
        }
    };
    //

    public async getAll(req: Request, res: Response, next: NextFunction) {
        const wallets = await this.services.walletService.getAll();
        res.send(wallets);
    }

    public async getAllByUserId(req: Request, res: Response, next: NextFunction) {
        const userId = +(req.params.uid);

        const wallets = await this.services.walletService.getAllByUserId(userId);

        if (!Array.isArray(wallets) || wallets.length === 0) {
            res.sendStatus(404);
            return;
        }

        res.send(wallets);
    }
    
    public async getByPublicAddress(req: Request, res: Response, next: NextFunction) {
        const publicAddress = req.params.publicAddress;

        const wallet = await this.services.walletService.getByPublicAddress(publicAddress);

        if (wallet === null) {
            res.sendStatus(404);
            return;
        }

        res.send(wallet);
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);

        const wallet = await this.services.walletService.getById(id);

        if (wallet === null) {
            res.sendStatus(404);
            return;
        }

        res.send(wallet);
    }

    public async createWallet(req: Request, res: Response, next: NextFunction) {
        const userId = +(req.params.uid);
        const data = req.body;

        if (!IAddWalletVerificator(data)) {
            res.status(400);
            res.send(IAddWalletVerificator.errors);
            return;
        }

        const result = await this.services.walletService.createWallet(userId, data as IAddWallet);

        res.send(result);
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const walletId = +(req.params.id);
        const data = req.body;

        if(!IEditWalletVerificator(data)) {
            res.status(400);
            res.send(IEditWalletVerificator.errors);
            return;
        }

        const result = await this.services.walletService.edit(walletId, data as IEditWallet);

        res.send(result);
    }

    public async updateBalance(req: Request, res: Response, next: NextFunction) {
        const publicAddress = req.params.publicAddress;

        const result = await this.services.walletService.updateBalance(publicAddress);

        res.send(result);
    }

    public async send(req: Request, res: Response, next: NextFunction) {
        const userId = +(req.params.uid);
        const data = req.body

        const result = await this.services.walletService.send(userId, data);
        
        res.send(result);
    }

    public async history(req: Request, res: Response, next: NextFunction) {
        const publicAddress = req.params.publicAddress;

        const result = await this.services.walletService.history(publicAddress);
    
        res.send(result);
    }
}

export default WalletController;