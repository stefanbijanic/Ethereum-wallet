import IModel from "../../common/IModel.interface";
import UserModel from "../user/model";

class WalletModel implements IModel {
    walletId: number;
    walletName: string;
    publicAddress: string;
    privateKey: string;
    balance: number;
    userId: number;
    user: UserModel;
    createdAt: Date;
}

export default WalletModel;