import path from 'path';

export default {
    PORT: 3000,
    DB_FILE_PATH: path.resolve(__dirname, '../../db/database.db'),
    DB_CURRENT_VERSION: 0
}