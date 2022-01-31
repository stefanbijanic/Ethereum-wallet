import IModel from "../../common/IModel.interface";

class AdministratorModel implements IModel {
    administratorId: number;
    username: string;
    passwordHash: string;
    isActive: boolean;
    createdAt: Date;
}

export default AdministratorModel;