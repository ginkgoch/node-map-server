import sqlite3 from "sqlite3";
import { DBUtils } from "../shared";

export class SimpleDao {
    db: sqlite3.Database

    constructor(db: sqlite3.Database) {
        this.db = db;
    }

    static async create(db?: sqlite3.Database) {
        if (!db) {
            db = await DBUtils.open();
        }

        return new SimpleDao(db);
    }

    async run(sql: string, params?: any) {
        return new Promise((res, rej) => {
            if (!params) {
                this.db.run(sql, err => {
                    if (err) {
                        rej(err);
                    }
                    else {
                        res();
                    }
                });
            }
            else {
                this.db.run(sql, params, err => {
                    if (err) {
                        rej(err);
                    }
                    else {
                        res();
                    }
                });
            }
        });
    }

    async close() {
        return new Promise((res, rej) => {
            this.db.close(err => {
                if (err) {
                    rej(err);
                }
                else {
                    res();
                }
            });
        });
    }
}