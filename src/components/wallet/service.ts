import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddWallet } from "./dto/IAddWallet";
import { IEditWallet } from "./dto/IEdditWallet";
import WalletModel from "./model";
import axios from "axios";

const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/" + process.env.ROPSTEN_API_KEY));

class WalletAdapterOptions implements IModelAdapterOptions{
    loadUser: boolean = false;
    loadPrivateKey: boolean = false;
}

class WalletService extends BaseService<WalletModel> {
    protected async adaptModel(data: any, options: Partial<WalletAdapterOptions>): Promise<WalletModel> {
        const wallet = new WalletModel();

        wallet.walletId = +(data?.wallet_id);
        wallet.walletName = data?.wallet_name;
        wallet.publicAddress = data?.public_address;
        wallet.balance = +(data?.balance);
        wallet.userId = +(data?.user_id);

        if (options.loadUser){
            wallet.user = await this.services.userService.getById(wallet.userId);
        }

        if (options.loadPrivateKey) {
            wallet.privateKey = data?.private_key;
        }

        return wallet;
    }

    public async getAll(): Promise<WalletModel[]> {
        const wallets = await this.getAllFromTable("wallet");
        return wallets as WalletModel[];
    }

    public async getAllByUserId(userId: number): Promise<WalletModel[]|null> {
        try {
            const wallets = await this.getAllByFieldNameFromTable("wallet", "user_id", userId);

            if (!Array.isArray(wallets) || wallets.length === 0) {
                return null;
            }

            return wallets;
        } catch (e) {
            return null;
        }
    }

    public async getByPublicAddress(publicAddress: string, options: Partial<WalletAdapterOptions> = {}): Promise<WalletModel|null> {
        try {
            const wallet = await this.getAllByFieldNameFromTable("wallet", "public_Address", publicAddress, options);
            
            if (!Array.isArray(wallet) || wallet.length === 0) {
                return null;
            }

            return wallet[0];
        } catch (e) {
            return null;
        }
    }

    public async getById(walletId: number): Promise<WalletModel|null> {
        const user = await this.getByIdFromTable("wallet", walletId);
        return user as WalletModel;
    }


    public async createWallet(userId: number, data: IAddWallet): Promise<WalletModel|IErrorResponse> {
        try {
            const account = web3.eth.accounts.create();
            const balance = await web3.eth.getBalance(account.address);
            const balanceEth = web3.utils.fromWei(balance, 'ether');

            const sql = `
                        INSERT
                            wallet
                        SET
                            wallet_name = ?,
                            public_address = ?,
                            private_key = ?,
                            balance = ?,
                            user_id = ?;
                        `
        
            const response = await this.db.execute(sql, [
                data.walletName,
                account.address.toLowerCase(),
                account.privateKey.toLowerCase(),
                balanceEth,
                userId,
            ]);

            return await this.getById(+(response[0] as any)?.insertId);
        } catch (e) {
            return({
                errorCode: e?.errno,
                errorMessage: e?.sqlMessage,
            })
        }
    }

    public async edit(walletId: number, data: IEditWallet): Promise<WalletModel|IErrorResponse|null> {
        try {
            const wallet = await this.getById(walletId);

            if (wallet === null) {
                return null;
            }

            const sql = `
                        UPDATE
                            wallet
                        SET
                            wallet_name = ?
                        WHERE
                            wallet_id = ?;
                        `
        
            const response = await this.db.execute(sql, [
                data.walletName,
                walletId,
            ]);

            return await this.getById(walletId);
        } catch (e) {
            return({
                errorCode: e?.errno,
                errorMessage: e?.sqlMessage,
            })
        }
    }

    public async updateBalance(publicAddress: string): Promise<WalletModel|IErrorResponse|null> {
        try {
            const wallet = await this.getByPublicAddress(publicAddress);

            if (wallet == null) {
                return null;
            }

            const balance = await web3.eth.getBalance(publicAddress);
            const balanceEth = web3.utils.fromWei(balance, 'ether');
            
            const sql = `
                        UPDATE
                            wallet
                        SET
                            balance = ?
                        WHERE
                            public_address = ?;
                        `
        
            const response = await this.db.execute(sql, [
                balanceEth,
                publicAddress,
            ]);

            return await this.getByPublicAddress(publicAddress);
        } catch (e) {
            return({
                errorCode: e?.errno,
                errorMessage: e?.sqlMessage,
            })
        }
    }

    public async send(
        userId: number, 
        data: any, options: 
        Partial<WalletAdapterOptions> = {loadPrivateKey: true, loadUser: true}
    ): Promise<WalletModel|IErrorResponse|null> {
        const addressFrom = data.publicAddress;
        const addressTo = data.addressTo;
        const amount = data.amount.toString();

        try {
            const wallet = await this.getByPublicAddress(addressFrom, options);

            if (wallet === null) {
                return null;
            }

            if (userId !== wallet.user.userId) {
                return({
                    errorCode: 3001,
                    errorMessage: "This user does not have access to this wallet",
                });
            }

            const privateKey = wallet.privateKey;

            const createTransaction = await web3.eth.accounts.signTransaction(
                {
                    from: addressFrom,
                    to: addressTo,
                    value: web3.utils.toWei(amount, "ether"),
                    gas: "21000",
                },
                privateKey,
            );

            await web3.eth.sendSignedTransaction(createTransaction.rawTransaction);
            
            await this.updateBalance(addressFrom);

            return await this.getByPublicAddress(addressFrom);
        } catch (e) {
            return({
                errorCode: 3002,
                errorMessage: "Something went wrong during the transaction.",
            });
        }
    }

    public async history(publicAddress: string) {
        const publicAddress1 = "0x20843619fb933ea7a5cc3bcbe7eafd6823a8e19d"
        let url = 'http://api-ropsten.etherscan.io/api?module=account&action=txlist&address=' + 
                    publicAddress + 
                    '&startblock=0&endblock=99999999&sort=asc&apikey=' + 
                    process.env.ETHERSCAN_API_KEY;

        try {
            let result = await axios.get(url);
            let transactions = [];
            result.data.result.forEach(element => {
                transactions.push({
                    "time": new Date(element.timeStamp * 1000),
                    "from": element.from,
                    "to": element.to,
                    "amount": web3.utils.fromWei(element.value),
                    "gas": element.gas,
                    "gasPrice": web3.utils.fromWei(element.gasPrice),
                    "gasUsed": web3.utils.fromWei(element.gasUsed),
                    "hash": element.hash,
                    "blockHash": element.blockHash
                })
            });

            return transactions;
        } catch (error) {
            
        }
    }
}

export default WalletService;