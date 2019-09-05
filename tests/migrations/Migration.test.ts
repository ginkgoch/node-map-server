import { MigrationManager } from '../../src/migrations';
import * as migrationDemos from './demo/Migrations';

describe('Migration', () => {
    it('parse version', () => {
        let version = MigrationManager._parseVersion('Migration_001');
        expect(version).toBe(1);

        version = MigrationManager._parseVersion('Migration_011');
        expect(version).toBe(11);

        version = MigrationManager._parseVersion('Migration_1');
        expect(version).toBe(1);
    });

    it('collect versions', () => {
        const ms = MigrationManager.migrations(migrationDemos);
        expect(ms.length).toBe(4);
        expect(ms[0].version).toBe(1);
        expect(ms[1].version).toBe(11);
        expect(ms[2].version).toBe(12);
        expect(ms[3].version).toBe(17);
    });
});