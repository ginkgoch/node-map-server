import Koa from "koa";
import compress from 'koa-compress';
import cors from '@koa/cors';
import logger from 'koa-logger';
import config from './config/config';
import { MapsRouter, DataSourcesRouter, UtilitiesRouter } from './routers';
import { MigrationManager } from "./migrations";

MigrationManager.migrate().then(() => {
    const app = new Koa();
    app.use(logger());
    app.use(cors());
    app.use(compress({
        threshold: 1024,
        filter: contentType => /image/i.test(contentType) || /json/i.test(contentType)
    }))
    app.use(DataSourcesRouter.routes());
    app.use(DataSourcesRouter.allowedMethods());
    app.use(MapsRouter.routes());
    app.use(MapsRouter.allowedMethods());
    app.use(UtilitiesRouter.routes());
    app.use(UtilitiesRouter.allowedMethods());

    app.listen(config.PORT, () => {
        console.log(`Server listening on port ${config.PORT}`);
    })
});

