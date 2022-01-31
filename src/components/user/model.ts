import IModel from "../../common/IModel.interface";

class UserModel implements IModel {
    userId: number;
    username: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: Date;
    isActive: boolean
    resetToken: string;
}

export default UserModel;