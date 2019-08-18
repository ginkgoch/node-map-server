import _ from "lodash";

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
}