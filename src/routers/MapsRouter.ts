import Router from "koa-router";
import bodyParser from 'koa-body';
import { MapRouter } from '.';
import { Repositories } from "../repositories/Repositories";
import { Utils } from "../shared";
import { MapEngine } from "ginkgoch-map";
import { MapModel } from "../models";

const router = new Router();
router.get('/maps', async ctx => {
    const maps = await Repositories.maps.all(['id', 'name', 'description', 'createAt', 'updateAt', 'creator']);
    Utils.json(maps, ctx);
});

router.post('/maps', bodyParser(), async ctx => {
    try {
        const mapJSON = Utils.parseRequestBody(ctx);
        if (!mapJSON.content) {
            throw new Error('Map content does not exist. Bad request.');
        }

        const map = MapEngine.parseJSON(mapJSON.content);
        mapJSON.content = map.toJSON();

        const now = new Date().getTime();
        const mapModel: MapModel = {
            name: mapJSON.name,
            description: mapJSON.description,
            creator: mapJSON.creator,
            createAt: now,
            updateAt: now,
            content: JSON.stringify(mapJSON.content)
        };

        const result = await Repositories.maps.insert(mapModel);
        mapModel.id = result.lastID;
        Utils.json(mapJSON, ctx);
    }
    catch (e) {
        ctx.throw(400, e);
    }
});

router.use('/maps', MapRouter.routes());

export let MapsRouter = router;