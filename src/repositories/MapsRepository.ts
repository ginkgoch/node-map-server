import { SimpleDao } from ".";
import { MapModel } from "../models";
import { DBRunResult } from "./SimpleDao";

export class MapsRepository {
    constructor(public dao: SimpleDao) {
    }

    static async create(dao?: SimpleDao) {
        if (!dao) {
            dao = await SimpleDao.create();
        }

        return new MapsRepository(dao);
    }

    async init() {
        const schema = `
            CREATE TABLE IF NOT EXISTS Maps (
                id INTEGER NOT NULL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                description VARCHAR(256),
                createAt BIGINT NOT NULL,
                updateAt BIGINT NOT NULL,
                creator VARCHAR(100),
                content TEXT
            )
        `;
        console.debug('Creating table Maps...');
        await this.dao.run(schema);
        console.debug('Table Maps created.');
    }

    async insert(map: MapModel): Promise<DBRunResult> {
        const insertSql = `
            INSERT INTO Maps (name, description, createAt, updateAt, creator, content) VALUES (?, ?, ?, ?, ?, ?)
        `;
        const now = new Date().getTime();
        const lastID = await this.dao.run(insertSql, [map.name, map.description, now, now, map.creator, map.content]);
        return lastID;
    }

    async all(fields?: string[]) {
        let fieldSql = fields ? fields.join(',') : '*';
        const sql = `
            SELECT ${fieldSql} FROM Maps
        `;
        const rows = await this.dao.all(sql);
        return rows;
    }

    async get(id: number, fields?: string[]): Promise<MapModel> {
        let fieldSql = fields ? fields.join(',') : '*';
        const sql = `
            SELECT ${fieldSql} FROM Maps WHERE id=?
        `;

        const row = await this.dao.get(sql, [id]);
        return row;
    }

    async delete(id: number): Promise<DBRunResult> {
        const sql = `
            DELETE FROM Maps WHERE id=?
        `;

        return await this.dao.run(sql, [id]);
    }

    async update(map: MapModel): Promise<DBRunResult> {
        const sql = `
            UPDATE Maps SET name=?, description=?, updateAt=?, creator=?, content=? WHERE id=?
        `;

        const updateAt = new Date().getTime();
        return await this.dao.run(sql, [map.name, map.description, updateAt, map.creator, map.content, map.id]);
    }

    async close() {
        await this.dao.close();
    }
}