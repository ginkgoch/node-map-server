import _ from "lodash";
import { MapEngine, LayerGroup, FeatureLayer } from "ginkgoch-map";
import { RouterContext } from "koa-router";
import { IEnvelope } from "ginkgoch-geom";
import { MapModel } from "../models";

export class Utils {
    static resolveRouterPath(path: string, prefix?: string) {
        prefix = prefix || '';
        prefix = _.trimEnd(prefix, '/');
        path = _.trimStart(path, '/');
        let result = [prefix, path].join('/');

        if (!result.startsWith('/')) {
            result = '/' + result;
        }

        result = result.replace(/^\/\//, '/');
        return result;
    }

    static findGroup(groupName: string, map: MapEngine): LayerGroup | undefined {
        return map.groups.find(g => g.name === groupName);
    }

    static findLayer(layerName: string, groupName: string, map: MapEngine): FeatureLayer | undefined {
        const group = this.findGroup(groupName, map);
        if (group === undefined) {
            return undefined;
        }

        const layer = group.layers.find(l => l.name === layerName);
        return layer;
    }

    static featuresFilter(ctx: RouterContext): FeaturesFilter {
        // ?fields=[]&from=0&limit=10&envelope=-180,-90，180，90

        const filter: FeaturesFilter = {};
        if (ctx.query.fields !== undefined) {
            filter.fields = (<string>ctx.query.fields).split(',');
        }

        if (ctx.query.from !== undefined) {
            filter.from = parseInt(<string>ctx.query.from);
        }

        if (ctx.query.limit !== undefined) {
            filter.limit = parseInt(<string>ctx.query.limit);
        }

        if (ctx.query.envelope !== undefined) {
            const envelopeParams = (<string>ctx.query.envelope).split(',');
            if (envelopeParams.length === 4) {
                let [minx, miny, maxx, maxy] = envelopeParams.map(p => parseFloat(p));
                filter.envelope = { minx, miny, maxx, maxy};
            }
        }

        return filter;
    }

    static getMapModel(name: string, map: MapEngine, description?: string, creator?: string): MapModel {
        return {  
            name,
            description: description || '',
            creator: creator || 'Admin',
            content: JSON.stringify(map.toJSON())
        }
    }

    static json(json: any, ctx: RouterContext) {
        ctx.body = json;
        ctx.type = 'json';
    }

    static notFound(message: string, ctx: RouterContext) {
        ctx.status = 404;
        ctx.message = message;
    }
}

export interface FeaturesFilter {
    fields?: string[],
    from?: number,
    limit?: number,
    envelope?: IEnvelope
}