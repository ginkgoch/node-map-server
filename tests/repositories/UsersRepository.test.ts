import sqlite3 from 'sqlite3';
import { SimpleDao, UsersRepository } from "../../src/repositories";
import { UserModel } from '../../src/models';

const dbPath = ':memory:';
describe('UsersRepository', () => {
    let repo: UsersRepository;

    beforeAll(async () => {
        const dao = await SimpleDao.create(new sqlite3.Database(dbPath));
        repo = await UsersRepository.create(dao);
        await repo.init();
    });

    afterAll(async () => {
        await repo.close();
    });

    it('CRUD', async () => {
        let records = await repo.all();
        expect(records.length).toBe(0);

        const user: UserModel = { name: 'Chris', password: '123456', email: 'chris@google.com' };
        let result = await repo.insert(user);

        records = await repo.all();
        expect(records.length).toBe(1);
        expect(records[0].password).not.toEqual(user.password);

        user.id = result.lastID;
        let fetchUserModel = await repo.get(user.id);
        expect(fetchUserModel.name).toEqual('Chris');

        user.name = 'Jenny';
        await repo.update(user);

        records = await repo.all();
        expect(records.length).toBe(1);
        
        fetchUserModel = await repo.get(user.id);
        expect(fetchUserModel.name).toEqual('Jenny');
        expect(fetchUserModel.updateAt).not.toEqual(fetchUserModel.createAt);

        let recordByUserFilter = await repo.getUserBy(new Map<string, string>([['name', 'Jenny']]));
        expect(recordByUserFilter).not.toBeNull();
        expect(recordByUserFilter).not.toBeUndefined();
        expect(recordByUserFilter!.name).toEqual('Jenny');

        recordByUserFilter = await repo.getUserBy(new Map<string, string>([['name', 'Max']]));
        expect(recordByUserFilter).toBeUndefined();

        result = await repo.delete(user.id);
        expect(result.changes).toBe(1);

        records = await repo.all();
        expect(records.length).toBe(0);
    });
});