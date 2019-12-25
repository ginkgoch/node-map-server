import { MapEngine } from "ginkgoch-map";
import { Repositories } from "../repositories/Repositories";

export class MapService {
    private static _instance: MapService | null = null;
    private static _mapEngineCache = new Map<number, MapEngine>();
    private static _mapUpdatedCache = new Map<number, number>();

    static get instance(): MapService {
        if (this._instance === null) {
            this._instance = new MapService();
        }

        return this._instance;
    }

    async getMapEngine(id: number): Promise<MapEngine> {
        if (!(await MapService.checkCacheUpToDate(id))) {
            console.log(`Map cache <${id}> expired, updating...`);
            const mapModel = await Repositories.maps.get(id);
            const mapState = MapEngine.parseJSON(mapModel.content);
            MapService._mapEngineCache.set(id, mapState);
            MapService._mapUpdatedCache.set(id, mapModel.updateAt!);
            
            console.log(`Map cache <${id}> updated`);
        }

        return MapService._mapEngineCache.get(id)!;
    }

    updateMapEngine(id: number, mapEngine: MapEngine, updateAt: number) {
        MapService._mapUpdatedCache.set(id, updateAt);
        MapService._mapEngineCache.set(id, mapEngine);
    }

    private static async checkCacheUpToDate(id: number): Promise<boolean> {
        const currentUpdateAt = MapService._mapUpdatedCache.get(id);
        if (currentUpdateAt === undefined) {
            return false;
        } else {
            try {
                const mapModel = await Repositories.maps.get(id, ['updateAt']);
                const latestUpdateAt = mapModel.updateAt!;
                return currentUpdateAt >= latestUpdateAt;
            } catch (ex) {
                return false;
            }
        }
    }
}