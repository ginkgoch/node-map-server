import fs from "fs";
import path from "path";
import Router from "koa-router";
import config from "../config/config";
import { Utils, IOUtils } from "../shared";
import { DSAdaptorFactory } from "../shared";

const router = new Router();
router.get('get data sources', '/dataSources', async ctx => {
    const rootPath = config.DS_ROOT;
    if (!fs.existsSync(rootPath)) {
        Utils.json([], ctx);
    }

    const filePaths = IOUtils.readDir(rootPath, ['.shp']).map(f => path.relative(process.cwd(), f));
    const dataSources = new Array<any>();
    for (let filePath of filePaths) {
        const dataSource = await DSAdaptorFactory.info(filePath);
        if (dataSource && dataSource.error === undefined) {
            dataSources.push(dataSource);
        }
    }
    Utils.json(dataSources, ctx);
});

export const DataSourcesRouter = router;