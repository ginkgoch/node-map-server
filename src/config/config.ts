import path from 'path';
import process from 'process';

export default {
    PORT: 3000,
    ADMIN: 'admin',
    ADMIN_PASSWORD: 'admin',
    ADMIN_EMAIL: 'ginkgoch@outlook.com',
    JWT_SECRET: 'RESET',
    DB_FILE_PATH: path.resolve(__dirname, '../../db/database.db'),
    DB_CURRENT_VERSION: 0,
    DS_ROOT: path.join(process.cwd(), 'src/data/'),
    DS_ROOT_EX: [
        path.join(process.cwd(), 'data/')
    ]
}