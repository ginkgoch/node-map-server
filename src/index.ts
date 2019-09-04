import Koa from "koa";
import config from './config/config';
import { MapsRouter } from './routers';
import { Repositories } from "./repositories/Repositories";

Repositories.init().then(() => {
    const app = new Koa();
    app.use(MapsRouter.routes());
    app.use(MapsRouter.allowedMethods());
    
    app.listen(config.PORT, () => {
        console.log(`Server listening on port ${config.PORT}`);
    })
});
