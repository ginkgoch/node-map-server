import Router, { RouterContext } from 'koa-router';
import bodyParser from 'koa-body';
import { Colors } from 'ginkgoch-map';
import { Utils } from '../shared';

const router = new Router();

/**
 * @example
 * {
 *   count: 20,
 *   startColor: #999999,
 *   endColor: #900000
 * }
 */
router.post('Break down colors', '/utilities/color/breakdown', bodyParser(), ctx => {
    const params = JSON.parse(ctx.request.body);
    validateClassBreakParams(params, ctx);

    const colors = Colors.between(<string>params.fromColor, <string>params.toColor, params.count);
    Utils.json(colors, ctx);
});

function validateClassBreakParams(params: any, ctx: RouterContext) {
    const expectedKeys = ['count', 'fromColor', 'toColor'];
    const valid = Object.keys(params).every(k => expectedKeys.includes(k));
    if (!valid) {
        ctx.throw(400, 'Invalid parameters to generate class breaks.');
    }
}

export const UtilitiesRouter = router;
