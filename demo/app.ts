import Koa from "koa";
import conf from './conf';
import MapServices from './services/MapServices';
import { GkMapRouter } from "../src";

const app = new Koa();

const router = GkMapRouter(ctx => MapServices.map(), '/maps');
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(conf.PORT, () => {
    console.log(`Server listening on port ${conf.PORT}`);
})