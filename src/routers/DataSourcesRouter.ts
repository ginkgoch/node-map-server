import fs from "fs";
import _ from "lodash";
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

    const filePaths = collectFilePaths();
    const dataSources = new Array<any>();
    for (let filePath of filePaths) {
        const dataSource = await DSAdaptorFactory.info(filePath);
        if (dataSource && _.isEmpty(dataSource.error)) {
            dataSources.push(dataSource);
        }
    }
    Utils.json(dataSources, ctx);
});

function collectFilePaths() {
    const filePaths: string[] = [];
    const filePathsDefault = IOUtils.readDir(config.DS_ROOT, ['.shp']).map(f => path.relative(process.cwd(), f));
    filePaths.push(...filePathsDefault);

    if (config.DS_ROOT_EX && config.DS_ROOT_EX.length > 0) {
        for (let rootEx of config.DS_ROOT_EX) {
            if (!fs.existsSync(rootEx)) continue;

            const filePathsEx = IOUtils.readDir(rootEx, ['.shp']).map(f => path.relative(process.cwd(), f));
            filePaths.push(...filePathsEx);
        }
    }

    return filePaths;
}

export const DataSourcesRouter = router;