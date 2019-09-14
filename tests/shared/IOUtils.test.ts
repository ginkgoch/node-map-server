import { IOUtils } from "../../src/shared";
import config from "../../src/config/config";

describe('IOUtils', () => {
    it('read dir', () => {
        let files = IOUtils.readDir(config.DS_ROOT, ['.shp']);
        expect(files.length).toBe(3);

        files = IOUtils.readDir(config.DS_ROOT, ['.txt']);
        expect(files.length).toBe(0);
    });
});