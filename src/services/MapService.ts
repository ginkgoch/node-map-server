import { XYZMap, ShapefileFeatureSource, FeatureLayer, FillStyle } from "ginkgoch-map";
import { Repositories } from "../repositories/Repositories";

export class MapService {
    private static _instance: MapService | null = null;
    private static _mapInfoCache: Map<number, XYZMap> = new Map<number, XYZMap>();

    static get instance(): MapService {
        if (this._instance === null) {
            this._instance = new MapService();
        }

        return this._instance;
    }

    async getMapState(id: number): Promise<XYZMap> {
        if (!MapService._mapInfoCache.has(id)) {
            const mapState = await this._getMapState(id);
            MapService._mapInfoCache.set(id, mapState);
        }

        return MapService._mapInfoCache.get(id)!;
    }

    protected async _getMapState(id: number): Promise<XYZMap> {
        // const map = new XYZMap(256, 256, 'GOOGLE');
        // const source1 = new ShapefileFeatureSource('./demo/data/cntry02-900913.shp');
        // source1.projection.from.projection = 'GOOGLE';
        // source1.projection.to.projection = 'GOOGLE';
        // const layer1 = new FeatureLayer(source1);
        // layer1.styles.push(new FillStyle('#ff0000', '#0000ff', 1));
        // map.pushLayers([layer1]);

        // return map;

        const mapModel = await Repositories.maps.get(id);
        const mapJSON = JSON.parse(mapModel.content);
        const map = XYZMap.parseJSON(mapJSON);

        const xyzMap = new XYZMap();
        xyzMap.name = map.name;
        xyzMap.srs = map.srs;
        xyzMap.width = map.width;
        xyzMap.height = map.height;
        xyzMap.maximumScale = map.maximumScale;
        xyzMap.minimumScale = map.minimumScale;
        xyzMap.scales = map.scales;
        xyzMap.groups = map.groups;
        xyzMap.background = map.background;
        return xyzMap;
    }
}