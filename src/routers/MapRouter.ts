import _ from 'lodash';
import '../shared/Native';
import Router from "koa-router";
import { MapService } from '../services';
import { MapEngine } from "ginkgoch-map";
import { Utils } from "../shared/Utils";
import { Repositories } from '../repositories/Repositories';

const router = new Router();

async function getMapHandler(mapID: number): Promise<MapEngine> {
    return await MapService.instance.getMapState(mapID);
}

//#region map
router.get('get map', Utils.resolveRouterPath('/:map'), async ctx => {
    const mapModel = await Repositories.maps.get(ctx.params.map);
    Utils.json(mapModel, ctx);
});
//#endregion

//#region group
router.get('groups', Utils.resolveRouterPath('/:map/groups'), async ctx => {
    const map = await getMapHandler(ctx.params.map);
    const groups = map.groups.map(g => g.toJSON());
    Utils.json(groups, ctx);
});

router.get('group', Utils.resolveRouterPath('/:map/groups/:group'), async ctx => {
    const map = await getMapHandler(ctx.params.map);
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
    const map = await getMapHandler(ctx.params.map);
    const group = Utils.findGroup(ctx.params.group, map);
    if (group === undefined) {
        Utils.notFound(`Group ${ctx.params.group} is not found.`, ctx);
    }
    else {
        Utils.json(group.layers.map(l => l.toJSON()), ctx);
    }
});

router.get('layer', Utils.resolveRouterPath('/:map/groups/:group/layers/:layer'), async ctx => {
    const map = await getMapHandler(ctx.params.map);
    const layer = Utils.findLayer(ctx.params.layer, ctx.params.group, map);
    if (layer === undefined) {
        Utils.notFound(`Layer ${ ctx.params.layer } is not found in group ${ ctx.params.group }.`, ctx);
    }
    else {
        const json = layer.toJSON();
        
        try {
            await layer.open();
            json.envelope = await layer.source.envelope();
            json.count = await layer.source.count();
        } 
        finally{
            await layer.close();
        }
        Utils.json(json, ctx);
    }
});
//#endregion

//#region features
router.get('features', Utils.resolveRouterPath('/:map/groups/:group/layers/:layer/features'), async ctx => {
    const map = await getMapHandler(ctx.params.map);
    const layer = Utils.findLayer(ctx.params.layer, ctx.params.group, map);
    if (layer === undefined) {
        Utils.notFound(`Layer ${ ctx.params.layer } is not found in group ${ ctx.params.group }.`, ctx);
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
    const map = await getMapHandler(ctx.params.map);
    const layer = Utils.findLayer(ctx.params.layer, ctx.params.group, map);
    if (layer === undefined) {
        Utils.notFound(`Layer ${ ctx.params.layer } is not found in group ${ ctx.params.group }.`, ctx);
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