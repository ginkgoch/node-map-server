import _ from "lodash";
import { MapEngine, LayerGroup, FeatureLayer } from "ginkgoch-map";
import { RouterContext } from "koa-router";
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

    static findLayer(layerId: string, groupName: string, map: MapEngine): FeatureLayer | undefined {
        const group = this.findGroup(groupName, map);
        if (group === undefined) {
            return undefined;
        }

        const layer = group.layers.find(l => l.id === layerId);
        return layer;
    }

    static getMapModel(name: string, map: MapEngine, description?: string, creator?: string): MapModel {
        return {  
            name,
            description: description || '',
            creator: creator || 'Admin',
            content: JSON.stringify(map.toJSON())
        }
    }

    static json(json: any, ctx: RouterContext, status: number = 200) {
        ctx.body = json;
        ctx.type = 'json';
        ctx.status = status;
    }

    static notFound(message: string, ctx: RouterContext) {
        ctx.status = 404;
        ctx.message = message;
    }
}