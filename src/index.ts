import Koa from "koa";
import config from './config/config';
import { router } from './routers';

const app = new Koa();
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
})