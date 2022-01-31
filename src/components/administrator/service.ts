import BaseService from "../../common/BaseService";
import IErrorResponse from "../../common/IErrorResponse.interface";
import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import { IAddAdministrator } from "./dto/IAddAdministrator";
import AdministratorModel from "./model";
import * as bcrypt from "bcrypt";
import { IEditAdministrator } from "./dto/IEditAdministrator";

class AdministratorModelAdapterOptions implements IModelAdapterOptions {

}

class AdministratorService extends BaseService<AdministratorModel> {
    protected async adaptModel(data: any, options: Partial<AdministratorModelAdapterOptions>): Promise<AdministratorModel> {
        const administrator = new AdministratorModel();

        administrator.administratorId = +(data?.administrator_id);
        administrator.passwordHash = data?.password_hash;
        administrator.username = data?.username;
        administrator.isActive = +(data?.is_active) === 1;
        administrator.createdAt = new Date(data?.created_at);

        return administrator;
    }

    public async getAll(): Promise<AdministratorModel[]> {
        const administrators = await this.getAllFromTable("administrator");
        return administrators as AdministratorModel[]; 
    }

    public async getByUsername(username: string): Promise<AdministratorModel|null> {
        try {
            const administrators = await this.getAllByFieldNameFromTable("administrator", "username", username);
            
            if (!Array.isArray(administrators) || administrators.length === 0) {
                return null;
            }

            return administrators[0];
        } catch (e) {
            return null
        }
    }

    public async getById(administratorId: number): Promise<AdministratorModel|null> {
        const administrator = await this.getByIdFromTable("administrator", administratorId);
        return administrator as AdministratorModel;
    }

    public async add(data: IAddAdministrator): Promise<AdministratorModel|IErrorResponse> {
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
                            administrator
                        SET 
                            username = ?,
                            password_hash = ?,
                            is_active = 1; 
                        `;
            
            const response = await this.db.execute(sql, [
                data.username,
                passwordHash,
            ])
            
            return await this.getById(+(response[0] as any)?.insertId);
        } catch (e) {
            return({
                errorCode: e?.errno,
                errorMessage: e?.sqlMessage,
            })
        }
    }

    public async edit(administratorId: number, data: IEditAdministrator): Promise<AdministratorModel|IErrorResponse|null> {
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
                            administrator
                        SET 
                            password_hash = ?,
                            is_active = ?
                        WHERE
                            administrator_id = ?;
                        `;
            
            const res = await this.db.execute(sql, [
                passwordHash,
                data.isActive,
                administratorId,
            ])
            
            return await this.getById(administratorId);
        } catch (e) {
            return({
                errorCode: e?.errno,
                errorMessage: e?.sqlMessage,
            })
        }
    }
}

export default AdministratorService;