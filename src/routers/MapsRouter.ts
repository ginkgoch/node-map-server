import Router from "koa-router";
import { MapRouter } from '.';

const router = new Router();
router.use('/maps', MapRouter.routes());

export let MapsRouter = router;