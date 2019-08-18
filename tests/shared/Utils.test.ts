import { Utils } from "../../src/shared";

describe('Utils', () => {
    it('resolveUrlPath', () => {
        let path = Utils.resolveRouterPath('hello');
        expect(path).toEqual('/hello');

        path = Utils.resolveRouterPath('/hello');
        expect(path).toEqual('/hello');

        path = Utils.resolveRouterPath('/hello', 'maps');
        expect(path).toEqual('/maps/hello');

        path = Utils.resolveRouterPath('/hello', '/maps');
        expect(path).toEqual('/maps/hello');

        path = Utils.resolveRouterPath('/hello', '//maps');
        expect(path).toEqual('/maps/hello');
    });
});