import _ from 'lodash';
import '../shared/Native';
import Router from "koa-router";
import bodyParser from "koa-body";
import { MapService } from '../services';
import { MapEngine, Geometry, Point, Envelope, Polygon, LinearRing, Projection, ShapefileFeatureSource } from "ginkgoch-map";
import { Utils } from "../shared/Utils";
import { Repositories } from '../repositories/Repositories';
import { FilterUtils, LayerUtils } from '../shared';
import { SpatialUtils } from '../shared/SpatialUtils';

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
    const mapJSON = Utils.parseRequestBody(ctx);
    const mapEngine = MapEngine.parseJSON(mapJSON.content);
    mapJSON.content = mapEngine.toJSON();
    const runResult = await Repositories.maps.update(mapJSON);

    if (runResult.changes !== 1) {
        ctx.throw(404, new Error(`Map ID: ${mapJSON.id} doesn't exist.`));
    }

    MapService.instance.updateMapEngine(mapJSON.id, mapEngine, mapJSON.updateAt);
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

router.get('intersection', '/:map/query/intersection', async ctx => {
    const params = FilterUtils.parseIntersectionFilter(ctx);
    if (params.geom === undefined
        || (params.geom.length !== 2 && params.geom.length !== 4)
        || params.geomSrs === undefined
        || params.level === undefined
        || params.tolerance === undefined) {
        ctx.throw(400, new Error('Intersection parameter is not valid. Be sure the geom, geomSrs, level and tolerance are properly set.'));
    }

    const mapEngine = await getMapEngine(ctx.params.map);
    let geom: Geometry;
    if (params.geom!.length === 2) {
        const [x, y] = params.geom!;
        geom = new Point(x, y);
    }
    else {
        const [minx, miny, maxx, maxy] = params.geom!;
        geom = new Polygon(new LinearRing([
            { x: minx, y: miny },
            { x: maxx, y: miny },
            { x: maxx, y: maxy },
            { x: minx, y: maxy },
            { x: minx, y: miny }
        ]));
    }

    const features = await mapEngine.intersection(geom, params.geomSrs!, params.level!, params.tolerance!);

    if (params.simplify) {
        const scale = mapEngine.scales[params.level!];
        features.forEach(l => l.features.forEach(f => f.geometry = SpatialUtils.simplify(f.geometry, scale, mapEngine.srs.unit, 1)));
    }

    if (params.outSrs && params.outSrs !== mapEngine.srs.projection) {
        const proj = new  Projection(mapEngine.srs.projection, params.outSrs);
        features.forEach(l => l.features.forEach(f => f.geometry = proj.forward(f.geometry)));
    }

    return Utils.json(features, ctx);
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
        let json = layer.toJSON();
        try {
            await layer.open();
            json.envelope = await layer.source.envelope();
            json.count = await layer.source.count();
            json.geomType = LayerUtils.shapefileTypeToGeomType((<ShapefileFeatureSource>layer.source).shapeType);
        }
        finally {
            await layer.close();
        }

        json = FilterUtils.applyLayerFilterFromContext(json, ctx);
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
        const filter = FilterUtils.parseFeaturesFilter(ctx);

        await layer.open();
        let features = await layer.source.features(filter.envelope, filter.fields);
        features = FilterUtils.applyFeaturesFilter(features, filter);
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
        const filter = FilterUtils.parseFeaturesFilter(ctx);

        try {
            await layer.open();
            let properties = await layer.source.properties(filter.fields);
            properties = FilterUtils.applyPropertiesFilter(properties, filter);
            Utils.json(properties, ctx);
        }
        finally {
            await layer.close();
        }
    }
});

router.get('property', Utils.resolveRouterPath('/:map/groups/:group/layers/:layer/properties/:field'), async ctx => {
    const map = await getMapEngine(ctx.params.map);
    const layer = Utils.findLayer(ctx.params.layer, ctx.params.group, map);
    if (layer === undefined) {
        Utils.notFound(`Layer ${ctx.params.layer} is not found in group ${ctx.params.group}.`, ctx);
    }
    else {
        const filter = FilterUtils.parseFeaturesFilter(ctx);
        const fieldName = ctx.params.field;

        try {
            await layer.open();
            let properties = await layer.source.properties([fieldName]);
            properties = FilterUtils.applyPropertiesFilter(properties, filter);

            let propertyValues = properties.map(p => _.has(p, fieldName) ? _.result(p, fieldName) : null);
            propertyValues = FilterUtils.applyPropertyAggregatorsFromContext(propertyValues, ctx);
            Utils.json(propertyValues, ctx);
        }
        finally {
            await layer.close();
        }
    }
});

router.get('fields', '/:map/groups/:group/layers/:layer/fields', async ctx => {
    const map = await getMapEngine(ctx.params.map);
    const layer = Utils.findLayer(ctx.params.layer, ctx.params.group, map);
    if (layer === undefined) {
        Utils.notFound(`Layer ${ctx.params.layer} is not found in group ${ctx.params.group}.`, ctx);
    }
    else {
        try {
            await layer.open();
            const fields = await layer.source.fields();

            let fieldsJSON: any[] = fields.map(f => f.toJSON());
            fieldsJSON = FilterUtils.applyFieldTypesFilterFromContext(fieldsJSON, ctx);
            fieldsJSON = FilterUtils.applyFieldsFilterFromContext(fieldsJSON, ctx);

            Utils.json(fieldsJSON, ctx);
        }
        finally {
            await layer.close();
        }
    }
});
//#endregion

export let MapRouter = router;