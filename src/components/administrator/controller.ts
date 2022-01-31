import BaseController from "../../common/BaseController";
import {Request, Response, NextFunction} from "express";
import { IAddAdministrator, IAddAdministratorValidator } from "./dto/IAddAdministrator";
import { IEditAdministrator, IEditAdministratorValidator } from "./dto/IEditAdministrator";

class AdministratorController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        const administrators = await this.services.administratorService.getAll();
        res.send(administrators);
    }
    
    public async getByUsername(req: Request, res: Response, next: NextFunction) {
        const username = req.params.username;

        const administrator = await this.services.administratorService.getByUsername(username);

        if (administrator === null) {
            res.sendStatus(404);
            return;
        }

        res.send(administrator);
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);

        const administrator = await this.services.administratorService.getById(id);

        if (administrator === null) {
            res.sendStatus(404);
            return;
        }

        res.send(administrator);
    }

    public async add(req: Request, res: Response, nex: NextFunction) {
        const data = req.body;

        if (!IAddAdministratorValidator(data)) {
            res.status(400);
            res.send(IAddAdministratorValidator.errors);
            return;
        }

        const result = await this.services.administratorService.add(data as IAddAdministrator);
        res.send(result);
    }

    public async edit(req: Request, res: Response, nex: NextFunction) {
        const id = +(req.params.id);
        const data = req.body;

        if (!IEditAdministratorValidator(data)) {
            res.status(400);
            res.send(IEditAdministratorValidator.errors);
            return;
        }

        const result = await this.services.administratorService.edit(id, data as IEditAdministrator)
        res.send(result);
    }
}

export default AdministratorController;