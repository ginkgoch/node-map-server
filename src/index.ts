import Koa from "koa";
import cors from '@koa/cors';
import logger from 'koa-logger';
import config from './config/config';
import { MapsRouter } from './routers';
import { MigrationManager } from "./migrations";
import { DataSourcesRouter } from "./routers/DataSourcesRouter";

MigrationManager.migrate().then(() => {
    const app = new Koa();
    app.use(logger());
    app.use(cors());
    app.use(DataSourcesRouter.routes());
    app.use(DataSourcesRouter.allowedMethods())
    app.use(MapsRouter.routes());
    app.use(MapsRouter.allowedMethods());

    app.listen(config.PORT, () => {
        console.log(`Server listening on port ${config.PORT}`);
    })
});

