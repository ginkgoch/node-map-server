import Router, { RouterContext } from "koa-router";
import { XYZMap } from "ginkgoch-map";
import { Utils } from "../shared/Utils";
import { Register } from ".";

export let ImageRegister: Register = function(router: Router, getMapHandler: (ctx: RouterContext) => XYZMap, prefix?: string) {
    router.get('images', Utils.resolveRouterPath('/images/:z/:x/:y', prefix), async ctx => {
        const [z, x, y] = [ctx.params.z, ctx.params.x, ctx.params.y];

        const map = getMapHandler(ctx);
        let image = await map.xyz(x, y, z);
        let buff = ctx.body = image.toBuffer();
    
        ctx.response.type = 'png';
        ctx.response.length = buff.length;
    });
};