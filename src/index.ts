import Koa from "koa";
import config from './config/config';
import { MapsRouter } from './routers';

const app = new Koa();
app.use(MapsRouter.routes());
app.use(MapsRouter.allowedMethods());

app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
})