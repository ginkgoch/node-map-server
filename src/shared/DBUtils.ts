import fs from 'fs';
import sqlite3 from 'sqlite3';
import config from '../config/config';
import path from 'path';

export class DBUtils {
    static async open() {
        DBUtils._initDBFolder();
        if (fs.existsSync(config.DB_FILE_PATH)) {
            console.debug('Database file exists, skip creating.');
            return await this._open();
        }

        console.debug('Creating database...');
        const db = new sqlite3.Database(config.DB_FILE_PATH);
        console.debug('Created database', config.DB_FILE_PATH);

        return db;
    }

    static async _open(): Promise<sqlite3.Database> {
        return new Promise((res, rej) => {
            const db = new sqlite3.Database(config.DB_FILE_PATH, sqlite3.OPEN_READWRITE, err => {
                if (err) {
                    console.error(err);
                    rej(err);
                }
                else {
                    res(db);
                }
            })
        });
    }

    static async run(sql: string, db: sqlite3.Database): Promise<void> {
        return new Promise((res, rej) => {
            db.run(sql, (err) => {
                if (err) {
                    rej(err);
                }
                else {
                    res();
                }
            });
        });
    }

    private static _initDBFolder() {
        const dirname = path.dirname(config.DB_FILE_PATH);
        if(!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }
    }
}