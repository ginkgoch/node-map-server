import gk from 'ginkgoch-map';

export default class Services {
    static map() {
        const map = new gk.mapping.XYZMap(256, 256, 'GOOGLE');

        const source1 = new gk.layers.ShapefileFeatureSource('./demo/data/cntry02-900913.shp');
        source1.projection.from.projection = 'GOOGLE';
        source1.projection.to.projection = 'GOOGLE';

        const layer1 = new gk.layers.FeatureLayer(source1);
        layer1.styles.push(new gk.styles.FillStyle('#ff0000', '#0000ff', 1));
        map.pushLayers([layer1]);

        return map;
    }
}