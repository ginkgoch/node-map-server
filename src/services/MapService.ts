import { MapEngine } from "ginkgoch-map";
import { Repositories } from "../repositories/Repositories";

export class MapService {
    private static _instance: MapService | null = null;
    private static _mapInfoCache = new Map<number, MapEngine>();

    static get instance(): MapService {
        if (this._instance === null) {
            this._instance = new MapService();
        }

        return this._instance;
    }

    async getMapState(id: number): Promise<MapEngine> {
        if (!MapService._mapInfoCache.has(id)) {
            const mapState = await this._getMapState(id);
            MapService._mapInfoCache.set(id, mapState);
        }

        return MapService._mapInfoCache.get(id)!;
    }

    protected async _getMapState(id: number): Promise<MapEngine> {
        const mapModel = await Repositories.maps.get(id);
        const map = MapEngine.parseJSON(mapModel.content);
        return map;
    }
}