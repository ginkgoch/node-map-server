import * as migrations from '.';
import config from '../config/config';
import { Repositories } from '../repositories/Repositories';

export abstract class Migration {
    version: number = 0;

    async beforeMigration () { }

    async afterMigration () { }

    async migrate(): Promise<void> { }
}

export class MigrationManager {
    static migrations(obj?: any): Array<Migration> {
        const _migrations = new Array<Migration>();

        const tasks = obj || migrations;
        Object.keys(tasks).filter(t => t.match(/migration_\d+/gi) && typeof tasks[t] === 'function').map(t => { 
            let task = new tasks[t]();
            if (task instanceof Migration) {
                task.version = MigrationManager._parseVersion(t);
                return task;
            }
            return null;
        }).filter(t => t !== null).sort((a, b) => a!.version - b!.version).forEach(t => _migrations.push(t!));

        return _migrations;
    }

    static _parseVersion(version: string): number {
        return parseInt(version.substr(version.indexOf('_') + 1));
    }

    static async migrate() {
        await Repositories.init();

        const tasks = this.migrations();
        const currentVersion = config.DB_CURRENT_VERSION;
        for (let task of tasks) {
            if (task.version <= currentVersion) continue;

            await task.beforeMigration();
            await task.migrate();
            await task.afterMigration();
        }
    }
}