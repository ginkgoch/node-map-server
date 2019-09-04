import sqlite3 from "sqlite3";
import { DBUtils } from "../shared";

export interface DBRunResult {
    lastID: number,
    changes: number
}

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

    async run(sql: string, params?: any): Promise<DBRunResult> {
        return new Promise((res, rej) => {
            function handleResult(this: sqlite3.RunResult, err: Error) {
                if (err) {
                    rej(err);
                }
                else {
                    res({ lastID: this.lastID, changes: this.changes });
                }
            }

            if (!params) {
                this.db.run(sql, handleResult);
            }
            else {
                this.db.run(sql, params, handleResult);
            }
        });
    }

    async all(sql: string, params?: any): Promise<any[]> {
        return new Promise((res, rej) => {
            function handleResult(err: Error, rows: any[]) {
                if (err) rej(err);
                else {
                    res(rows);
                }
            }

            if (params) {
                this.db.all(sql, params, handleResult);
            }
            else {
                this.db.all(sql, handleResult);
            }
        });
    }

    async get(sql: string, params?: any): Promise<any> {
        return new Promise((res, rej) => {
            function handleResult(err: Error, row: any) {
                if (err) {
                    rej(err);
                }
                else {
                    res(row);
                }
            }

            if (params) {
                this.db.get(sql, params, handleResult);
            }
            else {
                this.db.get(sql, handleResult);
            }
        });
    }

    async close(): Promise<void> {
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