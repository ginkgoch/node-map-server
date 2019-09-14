import path from 'path';
import process from 'process';

export default {
    PORT: 3000,
    DB_FILE_PATH: path.resolve(__dirname, '../../db/database.db'),
    DB_CURRENT_VERSION: 0,
    DS_ROOT: path.join(process.cwd(), 'src/data/')
}