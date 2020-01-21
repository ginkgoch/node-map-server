import Router from 'koa-router';
import { Utils } from '../shared';

const router = new Router();
router.get('get service version', '/version', async ctx => {
    Utils.json({
        'version': '0.0.1'
    }, ctx);
});

export const VersionRouter = router;