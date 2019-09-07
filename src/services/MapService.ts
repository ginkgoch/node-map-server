import { MapEngine } from "ginkgoch-map";
import { Repositories } from "../repositories/Repositories";

export class MapService {
    private static _instance: MapService | null = null;
    private static _mapEngineCache = new Map<number, MapEngine>();

    static get instance(): MapService {
        if (this._instance === null) {
            this._instance = new MapService();
        }

        return this._instance;
    }

    async getMapEngine(id: number): Promise<MapEngine> {
        if (!MapService._mapEngineCache.has(id)) {
            const mapState = await this._getMapEngine(id);
            MapService._mapEngineCache.set(id, mapState);
        }

        return MapService._mapEngineCache.get(id)!;
    }

    protected async _getMapEngine(id: number): Promise<MapEngine> {
        const mapModel = await Repositories.maps.get(id);
        const map = MapEngine.parseJSON(mapModel.content);
        return map;
    }

    updateMapEngine(id: number, mapEngine: MapEngine) {
        MapService._mapEngineCache.set(id, mapEngine);
    }
}