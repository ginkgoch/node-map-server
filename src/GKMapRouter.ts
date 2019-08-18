import _ from "lodash";
import Router, { RouterContext } from "koa-router";
import { XYZMap } from "ginkgoch-map";
import { ImageRegister, JSONInfoRegister } from './registers';
import './shared/Native';

export function GkMapRouter(getMapHandler: (ctx: RouterContext) => XYZMap, prefix?: string) {
    const router = new Router();

    ImageRegister(router, getMapHandler, prefix);
    JSONInfoRegister(router, getMapHandler, prefix);

    return router;
}