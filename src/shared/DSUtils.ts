import { ShapefileFeatureSource, GeometryType } from "ginkgoch-map";
import _ from "lodash";
import { LayerUtils } from "./LayerUtils";

interface DataSource {
    name: string,
    path: string,
    srs: string,
    count: number,
    sourceType: string,
    geomType: GeometryType,
    envelope: number[],
    error?: string
}

abstract class DSAdaptor {
    abstract match(path: string): boolean;

    abstract async info(path: string): Promise<DataSource>;

    abstract sourceType(): string;
}

class ShapefileAdaptor extends DSAdaptor {
    sourceType() {
        return 'Shapefile';
    }

    match(path: string): boolean {
        return path.match(/\.shp$/i) !== null;
    }

    async info(path: string): Promise<DataSource> {
        const sourceType = this.sourceType();
        const shapefileSource = new ShapefileFeatureSource(path);
        const name = shapefileSource.name;
        path = shapefileSource.filePath;
        let geomType = GeometryType.Unknown;
        let srs = '', count = 0, envelope: number[] = [];

        try {
            await shapefileSource.open();
            srs = _.defaultTo(_.result(shapefileSource, 'projection.from.projection'), 'Unknown');
            count = await shapefileSource.count();
            geomType = LayerUtils.shapefileTypeToGeomType(shapefileSource.shapeType);
            const { minx, miny, maxx, maxy } = await shapefileSource.envelope();
            envelope = [minx, miny, maxx, maxy];
            return { name, path, srs, count, sourceType, geomType, envelope };
        }
        catch (ex) {
            return { name, path, srs, count, sourceType, geomType, error: ex.toString(), envelope };
        }
        finally {
            await shapefileSource.close();
        }
    }
}

export class DSAdaptorFactory {
    static adaptors = [
        new ShapefileAdaptor()
    ];

    static async info(path: string) {
        const adaptor = this.adaptors.find(a => a.match(path));
        if (adaptor !== undefined) {
            return await adaptor.info(path);
        }
        else return undefined;
    }
}