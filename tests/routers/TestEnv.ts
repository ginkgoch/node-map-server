import Koa from 'koa';
import sqlite3 from 'sqlite3';
import logger from "koa-logger";
import { MapsRouter } from '../../src/routers';
import { SimpleDao } from "../../src/repositories";
import { Server } from 'http';
import { Repositories } from "../../src/repositories/Repositories";

export class TestEnv {
    static async serve(): Promise<Server> {
        const db = new sqlite3.Database(':memory:');
        const dao = new SimpleDao(db);

        await Repositories.init(dao);
        await Repositories.maps.init();

        const app = new Koa();
        app.use(logger());
        app.use(MapsRouter.routes());
        app.use(MapsRouter.allowedMethods());

        return new Promise((res, rej) => {
            const server = app.listen(3001, () => {
                res(server);
            });
        })
        
    }
}