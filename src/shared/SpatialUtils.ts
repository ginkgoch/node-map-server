import { Geometry, Point, MultiPoint, LineString, GeoUtils, Unit, MultiLineString, Polygon, LinearRing, MultiPolygon } from "ginkgoch-map";

export class SpatialUtils {
    static simplify(geom: Geometry, scale: number, unit: Unit, tolerance: number = 1): Geometry {
        if (geom instanceof Point || geom instanceof MultiPoint) {
            return geom;
        }
        
        const resolution = GeoUtils.resolution(scale, unit);
        if (geom instanceof LineString) {
            return this.simplifyLineString(geom, resolution, tolerance);
        }
        else if (geom instanceof MultiLineString) {
            return this.simplifyMultiLineString(geom, resolution, tolerance);
        }
        else if (geom instanceof Polygon) {
            return this.simplifyPolygon(geom, resolution, tolerance);
        }
        else if (geom instanceof MultiPolygon) {
            return this.simplifyMultiPolygon(geom, resolution, tolerance);
        }

        return geom;
    }

    private static simplifyMultiLineString(geom: MultiLineString, resolution: number, tolerance: number) {
        const newGeom = new MultiLineString();
        for (let lineString of geom.children) {
            newGeom.children.push(this.simplifyLineString(lineString, resolution, tolerance));
        }

        return newGeom;
    }

    private static simplifyLineString(geom: LineString, resolution: number, tolerance: number) {
        const newGeom = new LineString();
        const coordinates = geom.coordinates();

        let [px, py] = coordinates[0];
        let previous = { x: px, y: py };
        newGeom._coordinates.push(previous);
        for (let i = 1; i < coordinates.length; i++) {
            let [cx, cy] = coordinates[i];
            if (Math.abs(cx - previous.x) / resolution >= tolerance || Math.abs(cy - previous.y) / resolution >= tolerance || i === coordinates.length - 1) {
                previous = { x: cx, y: cy };
                newGeom._coordinates.push(previous);
            }
        }

        return newGeom;
    }

    private static simplifyMultiPolygon(geom: MultiPolygon, resolution: number, tolerance: number) {
        const newGeom = new MultiPolygon();
        for (let polygon of geom.children) {
            const newPolygon = this.simplifyPolygon(polygon, resolution, tolerance);
            newGeom.children.push(newPolygon);
        }

        return newGeom;
    }

    private static simplifyPolygon(geom: Polygon, resolution: number, tolerance: number) {
        const newGeom = new Polygon();
        newGeom.externalRing = this.simplifyLinearRing(geom.externalRing, resolution, tolerance);
        for (let ring of geom.internalRings) {
            const innerRing = this.simplifyLinearRing(ring, resolution, tolerance);
            newGeom.internalRings.push(innerRing);
        }

        return newGeom;
    }

    private static simplifyLinearRing(geom: LinearRing, resolution: number, tolerance: number) {
        const newGeom = new LinearRing();

        const coordinates = geom._coordinates;
        let previous = coordinates[0];

        newGeom._coordinates.push(previous);
        for (let i = 1; i < coordinates.length; i++) {
            let current = coordinates[i];
            if (Math.abs(current.x - previous.x) / resolution >= tolerance || Math.abs(current.y - previous.y) / resolution >= tolerance || i === coordinates.length - 1) {
                previous = current;
                newGeom._coordinates.push(previous);
            }
        }

        return newGeom;
    }
}