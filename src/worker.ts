import Koa from "koa";
import compress from 'koa-compress';
import cors from '@koa/cors';
import koa_jwt from 'koa-jwt';
import logger from 'koa-logger';
import config from './config/config';
import { MapsRouter, DataSourcesRouter, UtilitiesRouter, UsersRouter, VersionRouter } from './routers';
import { MigrationManager } from "./migrations";

export function serve(callback?: ()=>void) {
    return MigrationManager.migrate().then(() => {
        const app = new Koa();
        app.use(logger());
        app.use(cors());
        app.use(compress({
            threshold: 1024,
            filter: contentType => /image/i.test(contentType) || /json/i.test(contentType)
        }));
    
        app.use(koa_jwt({ secret: config.JWT_SECRET, passthrough: !config.AUTH_ENABLED }).unless({ path: [/\/users\/signin/ig] }));
        app.use(VersionRouter.routes()).use(VersionRouter.allowedMethods());
        app.use(UsersRouter.routes()).use(UsersRouter.allowedMethods());
        app.use(DataSourcesRouter.routes()).use(DataSourcesRouter.allowedMethods());
        app.use(MapsRouter.routes()).use(MapsRouter.allowedMethods());
        app.use(UtilitiesRouter.routes()).use(UtilitiesRouter.allowedMethods());
    
        app.listen(config.PORT, () => {
            console.log(`Server listening on port ${config.PORT}`);
            if (callback !== undefined) {
                callback();
            }
        })
    });
}
