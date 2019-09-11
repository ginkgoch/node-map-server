import _ from 'lodash';
import '../shared/Native';
import Router from "koa-router";
import bodyParser from "koa-body";
import { MapService } from '../services';
import { MapEngine } from "ginkgoch-map";
import { Utils } from "../shared/Utils";
import { Repositories } from '../repositories/Repositories';

const router = new Router();

async function getMapEngine(mapID: number | string): Promise<MapEngine> {
    if (typeof mapID === 'string') {
        mapID = parseInt(mapID);
    }
    
    return await MapService.instance.getMapEngine(mapID);
}

//#region map
router.get('get map', Utils.resolveRouterPath('/:map'), async ctx => {
    const mapModel = await Repositories.maps.get(ctx.params.map);
    Utils.json(mapModel, ctx);
});

router.put('edit map', '/:map', bodyParser(), async ctx => {
    const mapJSON = JSON.parse(ctx.request.body);
    const mapEngine = MapEngine.parseJSON(mapJSON.content);
    mapJSON.content = mapEngine.toJSON();
    const runResult = await Repositories.maps.update(mapJSON);

    if (runResult.changes !== 1) {
        ctx.throw(404, new Error(`Map ID: ${mapJSON.id} doesn't exist.`));
    }

    MapService.instance.updateMapEngine(mapJSON.id, mapEngine);
    Utils.json(mapJSON, ctx);
});

router.delete('delete map', '/:map', async ctx => {
    const mapID = parseInt(ctx.params.map);
    const runResult = await Repositories.maps.delete(mapID);
    if (runResult.changes === 0) {
        ctx.throw(404, `Map ID: ${mapID} doesn't exist.`);
    }

    Utils.json('', ctx, 204);
});

router.get('get xyz', '/:map/image/xyz/:z/:x/:y', async ctx => {
    const mapEngine = await getMapEngine(ctx.params.map);
    const { z, x, y } = ctx.params;

    let image = await mapEngine.xyz(x, y, z);
    let buff = ctx.body = image.toBuffer();

    ctx.type = 'png';
    ctx.length = buff.length;
});
//#endregion

//#region group
router.get('groups', Utils.resolveRouterPath('/:map/groups'), async ctx => {
    const map = await getMapEngine(ctx.params.map);
    const groups = map.groups.map(g => g.toJSON());
    Utils.json(groups, ctx);
});

router.get('group', Utils.resolveRouterPath('/:map/groups/:group'), async ctx => {
    const map = await getMapEngine(ctx.params.map);
    const group = Utils.findGroup(ctx.params.group, map);
    if (group === undefined) {
        Utils.notFound(`Group ${ctx.params.group} is not found.`, ctx);
    }
    else {
        Utils.json(group.toJSON(), ctx);
    }
});
//#endregion

//#region layer
router.get('layers', Utils.resolveRouterPath('/:map/groups/:group/layers'), async ctx => {
    const map = await getMapEngine(ctx.params.map);
    const group = Utils.findGroup(ctx.params.group, map);
    if (group === undefined) {
        Utils.notFound(`Group ${ctx.params.group} is not found.`, ctx);
    }
    else {
        Utils.json(group.layers.map(l => l.toJSON()), ctx);
    }
});

router.get('layer', Utils.resolveRouterPath('/:map/groups/:group/layers/:layer'), async ctx => {
    const map = await getMapEngine(ctx.params.map);
    const layer = Utils.findLayer(ctx.params.layer, ctx.params.group, map);
    if (layer === undefined) {
        Utils.notFound(`Layer ${ctx.params.layer} is not found in group ${ctx.params.group}.`, ctx);
    }
    else {
        const json = layer.toJSON();

        try {
            await layer.open();
            json.envelope = await layer.source.envelope();
            json.count = await layer.source.count();
        }
        finally {
            await layer.close();
        }
        Utils.json(json, ctx);
    }
});
//#endregion

//#region features
router.get('features', Utils.resolveRouterPath('/:map/groups/:group/layers/:layer/features'), async ctx => {
    const map = await getMapEngine(ctx.params.map);
    const layer = Utils.findLayer(ctx.params.layer, ctx.params.group, map);
    if (layer === undefined) {
        Utils.notFound(`Layer ${ctx.params.layer} is not found in group ${ctx.params.group}.`, ctx);
    }
    else {
        const filter = Utils.featuresFilter(ctx);

        await layer.open();
        let features = await layer.source.features(filter.envelope, filter.fields);

        let from = 0;
        let limit = features.length;
        if (filter.from) {
            from = filter.from;
        }
        if (filter.limit) {
            limit = filter.limit;
        }
        features = _.chain(features).slice(from, from + limit).value();

        Utils.json(features.map(f => f.toJSON()), ctx);
    }
});

router.get('properties', Utils.resolveRouterPath('/:map/groups/:group/layers/:layer/properties'), async ctx => {
    const map = await getMapEngine(ctx.params.map);
    const layer = Utils.findLayer(ctx.params.layer, ctx.params.group, map);
    if (layer === undefined) {
        Utils.notFound(`Layer ${ctx.params.layer} is not found in group ${ctx.params.group}.`, ctx);
    }
    else {
        const filter = Utils.featuresFilter(ctx);

        await layer.open();
        let properties = await layer.source.properties(filter.fields);

        let from = 0;
        let limit = properties.length;
        if (filter.from) {
            from = filter.from;
        }
        if (filter.limit) {
            limit = filter.limit;
        }
        properties = _.chain(properties).slice(from, from + limit).map(p => {
            const props: any = {};
            p.forEach((v, k) => props[k] = v);
            return props;
        }).value();

        Utils.json(properties, ctx);
    }
});
//#endregion

export let MapRouter = router;