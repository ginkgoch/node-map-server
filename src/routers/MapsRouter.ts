import Router from "koa-router";
import { MapRouter } from '.';
import { Repositories } from "../repositories/Repositories";
import { Utils } from "../shared";

const router = new Router();
router.get('/maps', async ctx => {
    const maps = await Repositories.maps.all(['id', 'name', 'description', 'createAt', 'updateAt', 'creator']);
    Utils.json(maps, ctx);
});

router.use('/maps', MapRouter.routes());

export let MapsRouter = router;