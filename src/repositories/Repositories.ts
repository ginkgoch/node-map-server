import { MapsRepository } from "./MapsRepository";
import { SimpleDao } from "./SimpleDao";
import { UsersRepository } from "./UsersRepository";

export class Repositories {
    private static _map: MapsRepository;
    private static _user: UsersRepository;
    private static _dao: SimpleDao;

    static async init(dao?: SimpleDao) {
        if (dao === undefined) {
            dao = await SimpleDao.create();
        }

        this._dao = dao;
        this._map = await MapsRepository.create(dao);
        this._user = await UsersRepository.create(dao);
    }

    static get maps() {
        return this._map;
    }

    static get users() {
        return this._user;
    }

    static async close() {
        await this._dao.close();
    }
}