import _ from 'lodash';
import crypto from 'crypto';
import { SimpleDao } from ".";
import { DBRunResult } from "./SimpleDao";
import { UserModel } from "../models/UserModel";

export class UsersRepository {
    constructor(public dao: SimpleDao) {
    }

    static async create(dao?: SimpleDao) {
        if (!dao) {
            dao = await SimpleDao.create();
        }

        return new UsersRepository(dao);
    }

    async init() {
        const schema = `
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER NOT NULL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100)  NOT NULL,
                password VARCHAR(32) NOT NULL,
                createAt BIGINT NOT NULL,
                updateAt BIGINT NOT NULL
            )
        `;

        console.debug('Creating table Users...');
        await this.dao.run(schema);
        console.debug('Table Users created.');
    }

    async insert(user: UserModel): Promise<DBRunResult> {
        const insertSql = `
            INSERT INTO Users (name, email, password, createAt, updateAt) VALUES (?, ?, ?, ?, ?)
        `;

        const now = new Date().getTime();
        const password = UsersRepository.encryptPassword(user.password);
        const lastID = await this.dao.run(insertSql, [user.name, user.email, password, now, now]);
        return lastID;
    }

    async all(fields?: string[]): Promise<UserModel[]> {
        let fieldSql = fields ? fields.join(',') : '*';
        const sql = `
            SELECT ${fieldSql} FROM Users
        `;

        const rows = await this.dao.all(sql);
        rows.forEach(UsersRepository.invalidPassword);

        return rows;
    }

    async get(id: number, fields?: string[]): Promise<UserModel> {
        let fieldSql = fields ? fields.join(',') : '*';
        const sql = `
            SELECT ${fieldSql} FROM Users WHERE id=?
        `;

        const row = await this.dao.get(sql, [id]);

        UsersRepository.invalidPassword(row);
        return row;
    }

    async delete(id: number): Promise<DBRunResult> {
        const sql = `
            DELETE FROM Users WHERE id=?
        `;

        return await this.dao.run(sql, [id]);
    }

    async update(user: UserModel): Promise<DBRunResult> {
        const sql = `
            UPDATE Users SET name=?, email=?, updateAt=? WHERE id=?
        `;

        const updateAt = new Date().getTime();
        return await this.dao.run(sql, [user.name, user.email, updateAt, user.id]);
    }

    async updatePassword(password: string, id: number) {
        const sql = `UPDATE Users SET password=?, updateAt=? WHERE id=?`;
        const encrypted = UsersRepository.encryptPassword(password);
        const updateAt = new Date().getTime();
        return await this.dao.run(sql, [encrypted, updateAt, id]);
    }

    async close() {
        await this.dao.close();
    }

    static encryptPassword(password: string) {
        const md5 = crypto.createHash('md5');
        const encrypted = md5.update(password).digest('hex');
        return encrypted;
    }

    private static invalidPassword(user: UserModel) {
        if (user.password) {
            user.password = '';
        }
    }
}