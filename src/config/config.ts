import path from 'path';
import process from 'process';
import os from 'os';

export default {
    PORT: 3000,
    ADMIN: 'admin',
    ADMIN_PASSWORD: 'admin',
    ADMIN_EMAIL: 'ginkgoch@outlook.com',
    JWT_SECRET: 'RESET',
    AUTH_ENABLED: false,
    CLUSTER_ON: process.env.CLUSTER_ON || false,
    CLUSTER_SLAVE_COUNT: process.env.CLUSTER_SLAVE_COUNT || os.cpus().length,
    DB_FILE_PATH: path.resolve(__dirname, '../../db/database.db'),
    DB_CURRENT_VERSION: 0,
    DS_ROOT: path.join(process.cwd(), 'src/data/'),
    DS_ROOT_EX: [
        path.join(process.cwd(), 'data/')
    ]
}