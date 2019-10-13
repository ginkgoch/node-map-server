import Router from "koa-router";
import bodyParser from "koa-body";
import { Utils } from "../shared";
import { Repositories } from "../repositories/Repositories";
import { UserModel } from "../models";

const router = new Router();
router.post('register user', '/users/signup', bodyParser(), async ctx => {
    const requestingUser = Utils.parseRequestBody(ctx) as UserModel;
    if (!requestingUser.name || !requestingUser.email || !requestingUser.password) {
        ctx.throw(400, 'Failed to create new user. User model must include name, email and password.');
    }

    let existingUser = await Repositories.users.getUserBy(new Map([['name', requestingUser.name], ['email', requestingUser.email]]), 'OR');
    if (existingUser !== undefined) {
        let failedReason = 'Failed to create new user.';
        if (existingUser.name === requestingUser.name) {
            failedReason += ` User name ${requestingUser.name} exists.`;
        }
        if (existingUser.email === requestingUser.email) {
            failedReason += ` User email ${requestingUser.email} exists.`;
        }

        ctx.throw(409, failedReason);
    }

    const result = await Repositories.users.insert(requestingUser);
    requestingUser.id = result.lastID;
    requestingUser.password = ''.padStart(requestingUser.password.length, '*');
    Utils.json(requestingUser, ctx);
});

export const UsersRouter = router;