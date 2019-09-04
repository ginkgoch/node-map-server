import { MapsRepository } from "./MapsRepository";

export class Repositories {
    private static _map: MapsRepository;

    static async init() {
        this._map = await MapsRepository.create();
    }

    static get maps() {
        return this._map;
    }
}