import AdministratorService from "../components/administrator/service";
import UserService from "../components/user/service";
import WalletService from "../components/wallet/service";

export default interface IServices {
    administratorService: AdministratorService;
    userService: UserService;
    walletService: WalletService;
}
