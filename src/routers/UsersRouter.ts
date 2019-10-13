import Router from "koa-router";
import bodyParser from "koa-body";
import { Utils } from "../shared";
import { Repositories } from "../repositories/Repositories";
import { UserModel } from "../models";
import { UsersRepository } from "../repositories";
import jwt from "jsonwebtoken";
import config from "../config/config";

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
    UsersRepository.invalidPassword(requestingUser);
    Utils.json(requestingUser, ctx);
});

router.post('login', '/users/signin', bodyParser(), async ctx => {
    const loginInfo = Utils.parseRequestBody(ctx);
    if (!loginInfo.name || !loginInfo.password) {
        ctx.throw(400, 'User name or password should not be empty.');
    }

    const password = UsersRepository.encryptPassword(loginInfo.password);
    const user = await Repositories.users.getUserBy(new Map([['name', loginInfo.name], ['password', password]]), 'AND');
    if (user === undefined) {
        ctx.throw(401, `User doesn't exist or password incorrect.`)
    }

    // Utils.json(user, ctx);
    const token = jwt.sign({
        id: user!.id,
        name: user!.name
    }, config.JWT_SECRET, { expiresIn: '2h' });

    Utils.json({ token }, ctx);
});

export const UsersRouter = router;