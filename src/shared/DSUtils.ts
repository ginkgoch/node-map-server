import { ShapefileFeatureSource, GeometryType, ShapefileType } from "ginkgoch-map";
import _ from "lodash";

interface DataSource {
    name: string,
    path: string,
    srs: string,
    count: number,
    sourceType: string,
    geomType: GeometryType,
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
        let srs = '';
        let count = 0;

        try {
            await shapefileSource.open();
            srs = _.defaultTo(_.result(shapefileSource, 'projection.from.projection'), 'Unknown');
            count = await shapefileSource.count();
            geomType = this.shapefileTypeToGeomType(shapefileSource.shapeType);
            return { name, path, srs, count, sourceType, geomType };
        }
        catch(ex) {
            return { name, path, srs, count, sourceType, geomType, error: ex.toString() };
        }
        finally {
            shapefileSource.close();
        }
    }

    shapefileTypeToGeomType(shapefileType: ShapefileType): GeometryType {
        switch (shapefileType) {
            case ShapefileType.point:
                return GeometryType.Point;
            case ShapefileType.polyLine:
                return GeometryType.LineString;
            case ShapefileType.polygon:
                return GeometryType.Polygon;
            case ShapefileType.multiPoint:
                return GeometryType.MultiPoint;
            default:
                return GeometryType.Unknown;
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