import fs from 'fs';
import path from 'path';

export class IOUtils {
    static readDir(dir: string, filters: string[] = []) {
        if (!fs.existsSync(dir) || !fs.lstatSync(dir).isDirectory()) {
            console.error('Read directory failed.', dir);
            return [];
        }

        return this._readDir(dir, filters);
    }

    private static _readDir(dir: string, filters: string[]) {
        const filePaths = fs.readdirSync(dir).map(f => path.join(dir, f));

        const filteredFilePaths: string[] = []; 
        filePaths.forEach(f => {
            const state = fs.lstatSync(f);
            if (state.isFile()) {
                if (filters.length === 0) {
                    filteredFilePaths.push(f);
                }
                else {
                    const matched = filters.map(filter => new RegExp(`\\${filter}$`, 'i')).some(reg => f.match(reg));
                    matched && filteredFilePaths.push(f);
                }
            }
            else if (state.isDirectory()) {
                const filesInDirectory = this._readDir(f, filters);
                filteredFilePaths.push(...filesInDirectory);
            }
        });

        return filteredFilePaths;
    }
}