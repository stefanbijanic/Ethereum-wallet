
import {Request, Response, NextFunction} from "express";
import BaseController from "../../common/BaseController";
import { IAddUser, IAddUserVerificator } from "./dto/IAddUser";
import { IEditUser, IEditUserVerificator } from "./dto/IEditUser";
import * as nodemailer from "nodemailer";
import * as smtpTransport from "nodemailer-smtp-transport"
import Config from "../../config/dev";

class UserController extends BaseController {
    public async getAll(req: Request, res: Response, next: NextFunction) {
        const users = await this.services.userService.getAll();
        res.send(users);
    }

    public async getByUsername(req: Request, res: Response, next: NextFunction) {
        const username = req.params.username;

        const user = await this.services.userService.getByUsername(username);

        if (user === null) {
            res.sendStatus(404);
            return;
        }

        res.send(user);
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);

        const user = await this.services.userService.getById(id);

        if (user === null) {
            res.sendStatus(404);
            return;
        }

        res.send(user);
    }

    public async add(req: Request, res: Response, next: NextFunction) {
        const data = req.body;

        if (!IAddUserVerificator(data)) {
            res.status(400);
            res.send(IAddUserVerificator.errors);
            return;
        }

        const result = await this.services.userService.add(data as IAddUser);

        res.send(result);
    }

    public async edit(req: Request, res: Response, next: NextFunction) {
        const id = +(req.params.id);
        const data = req.body;

        if (!IEditUserVerificator(data)) {
            res.status(400);
            res.send(IEditUserVerificator.errors);
            return;
        }

        const result = await this.services.userService.edit(id, data as IEditUser);
        res.send(result);
    }
}

export default UserController;