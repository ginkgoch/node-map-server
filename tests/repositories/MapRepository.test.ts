import sqlite3 from 'sqlite3';
import { MapsRepository, SimpleDao } from "../../src/repositories";
import { MapModel } from '../../src/models';

const dbPath = ':memory:';
describe('MapsRepository', () => {
    let repo: MapsRepository;

    beforeAll(async () => {
        const dao = await SimpleDao.create(new sqlite3.Database(dbPath));
        repo = await MapsRepository.create(dao);
        await repo.init();
    });

    afterAll(async () => {
        await repo.close();
    });

    it('CRUD', async () => {
        let records = await repo.all();
        expect(records.length).toBe(0);

        const mapModel: MapModel = { name: 'CreatedMap1', description: 'Created map 1', creator: 'Admin', content: 'content1' }
        let result = await repo.insert(mapModel);

        records = await repo.all();
        expect(records.length).toBe(1);

        mapModel.id = result.lastID;
        let fetchMapModel = await repo.get(mapModel.id);
        expect(fetchMapModel.name).toEqual('CreatedMap1');

        mapModel.name = 'CreateMap2';
        await repo.update(mapModel);

        records = await repo.all();
        expect(records.length).toBe(1);
        
        fetchMapModel = await repo.get(mapModel.id);
        expect(fetchMapModel.name).toEqual('CreateMap2');
        expect(fetchMapModel.updateAt).not.toEqual(fetchMapModel.createAt);

        result = await repo.delete(mapModel.id);
        expect(result.changes).toBe(1);

        records = await repo.all();
        expect(records.length).toBe(0);
    });
});