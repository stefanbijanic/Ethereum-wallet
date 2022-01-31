import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddUser } from "./dto/IAddUser";
import UserModel from "./model";
import * as bcrypt from "bcrypt";
import { IEditUser } from "./dto/IEditUser";

class UserAdapterOptions implements IModelAdapterOptions {

}

class UserService extends BaseService<UserModel> {
    protected async adaptModel(data: any, options: Partial<UserAdapterOptions>): Promise<UserModel> {
        const user = new UserModel();

        user.userId = +(data?.user_id);
        user.username = data?.username;
        user.passwordHash = data?.password_hash
        user.firstName = data?.first_name;
        user.lastName = data?.last_name;
        user.email = data?.email;
        user.isActive = +(data?.is_active) === 1;
        user.createdAt = new Date(data?.created_at);
        return user;
    }

    public async getAll(): Promise<UserModel[]> {
        const users = await this.getAllFromTable("user");
        return users as UserModel[];
    }

    public async getByUsername(username: string): Promise<UserModel|null> {
        try {
            const user = await this.getAllByFieldNameFromTable("user", "username", username);

            if (!Array.isArray(user) || user.length === 0) {
                return null;
            }

            return user[0];
        } catch (e) {
            return null;
        }
    }

    public async getById(userId: number): Promise<UserModel|null> {
        const user = await this.getByIdFromTable("user", userId);
        return user as UserModel;
    }

    public async add(data: IAddUser): Promise<UserModel|IErrorResponse> {
        try {
            const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/g;
            const validatePassword = data.password.match(passwordRegex);

            if (validatePassword === null) {
                return({
                    errorCode: 1001,
                    errorMessage: "Password must contain at least 8 characters,\n " +
                                    "One uppercase letter,\n" +  
                                    "One lowercase letter,\n" + 
                                    "One number and\n" +
                                    "One special character",
                })
            }

            const passwordHash = bcrypt.hashSync(data.password, 10);
            const sql = `
                        INSERT 
                            user
                        SET 
                            username = ?,
                            password_hash = ?,
                            first_name = ?,
                            last_name = ?,
                            email = ?,
                            is_active = 1; 
                        `;
            
            const response = await this.db.execute(sql, [
                data.username,
                passwordHash,
                data.firstName,
                data.lastName,
                data.email,
            ]);
            
            return await this.getById(+(response[0] as any)?.insertId);
        } catch (e) {
            return({
                errorCode: e?.errno,
                errorMessage: e?.sqlMessage,
            })
        }
    }

    public async edit(userId: number, data: IEditUser): Promise<UserModel|IErrorResponse> {
        try {
            const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/g;
            const validatePassword = data.password.match(passwordRegex);

            if (validatePassword === null) {
                return({
                    errorCode: 1001,
                    errorMessage: "Password must contain at least 8 characters,\n " +
                                    "One uppercase letter,\n" +  
                                    "One lowercase letter,\n" + 
                                    "One number and\n" +
                                    "One special character",
                })
            }

            const passwordHash = bcrypt.hashSync(data.password, 10);
            const sql = `
                        UPDATE 
                            user
                        SET 
                            password_hash = ?,
                            first_name = ?,
                            last_name = ?,
                            email = ?,
                            is_active = ?
                        WHERE
                            user_id = ?;
                        `;
            
            const response = await this.db.execute(sql, [
                passwordHash,
                data.firstName,
                data.lastName,
                data.email,
                data.isActive,
                userId,
            ])
            
            return await this.getById(userId);
        } catch (e) {
            return({
                errorCode: e?.errno,
                errorMessage: e?.sqlMessage,
            })
        }
    }

    public async getByEmail(email: string): Promise<UserModel|null> {
        try {
            const user = await this.getAllByFieldNameFromTable("user", "email", email);

            if (!Array.isArray(user) || user.length === 0) {
                return null;
            }

            return user[0];
        } catch (e) {
            return null;
        }
    }
}

export default UserService;