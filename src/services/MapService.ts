import { XYZMap, ShapefileFeatureSource, FeatureLayer, FillStyle } from "ginkgoch-map";

export class MapService {
    private static _instance: MapService | null = null;
    private static _mapInfoCache: Map<string, XYZMap> = new Map<string, XYZMap>();

    static get instance(): MapService {
        if (this._instance === null) {
            this._instance = new MapService();
        }

        return this._instance;
    }

    getMapState(id: string): XYZMap {
        if (!MapService._mapInfoCache.has(id)) {
            const mapState = this._getMapState();
            MapService._mapInfoCache.set(id, mapState);
        }

        return MapService._mapInfoCache.get(id)!;
    }

    protected _getMapState(): XYZMap {
        const map = new XYZMap(256, 256, 'GOOGLE');
        const source1 = new ShapefileFeatureSource('./demo/data/cntry02-900913.shp');
        source1.projection.from.projection = 'GOOGLE';
        source1.projection.to.projection = 'GOOGLE';
        const layer1 = new FeatureLayer(source1);
        layer1.styles.push(new FillStyle('#ff0000', '#0000ff', 1));
        map.pushLayers([layer1]);

        return map;
    }
}