import Router, { RouterContext } from "koa-router";
import { XYZMap } from "ginkgoch-map";

export interface Register {
    (router: Router, getMapHandler: (ctx: RouterContext) => XYZMap, prefix?: string): void;
}