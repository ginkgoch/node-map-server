import { Migration } from "./MigrationManager";
import { MapModel, UserModel } from "../models";
import { Repositories } from '../repositories/Repositories';
import config from '../config/config';

export class Migration_001 extends Migration {
    async migrate() {
        await this.initUsers();
        await this.initMap();
    }

    private async initUsers() {
        console.debug('Creating Users table.');
        await Repositories.users.init();
        console.debug('Created Users table.');

        const admin: UserModel = {
            name: config.ADMIN,
            email: config.ADMIN_EMAIL,
            password: config.ADMIN_PASSWORD
        };

        const existingAdmin = await Repositories.users.getUserBy(new Map([['name', admin.name], ['email', admin.email]]), 'AND');
        if (existingAdmin === undefined) {
            console.debug('Inserting admin account.');
            await Repositories.users.insert(admin);
            console.debug('Inserted admin account.');
        }
        else {
            console.debug('Admin account exists. Ignore inserting.')
        }
    }

    private async initMap() {
        const repository = Repositories.maps;
        await repository.init();
        await repository.clear();

        const firstMap: MapModel = {
            name: 'The Cedid Atlas Tercumesi',
            description: 'Selim III, then Sultan of the Ottoman empire, engaged in many reforms and modernizations during his reign, and this 1803 atlas was the first known complete printed atlas in the Muslim world to use European-style cartography. Only 50 copies were printed, and many of these were burned in a warehouse fire during a Janissary uprising of those opposed to Selim’s reforms, so it is also one of the rarest printed atlases.',
            creator: 'Admin',
            content: `{"name":"GKMap","srs":{"projection":"EPSG:3857","unit":"m"},"width":256,"height":256,"origin":"upperLeft","maximumScale":10000000000,"minimumScale":0,"scales":[591659030.6768064,295829515.3384032,147914757.6692016,73957378.8346008,36978689.4173004,18489344.7086502,9244672.3543251,4622336.17716255,2311168.088581275,1155584.0442906376,577792.0221453188,288896.0110726594,144448.0055363297,72224.00276816485,36112.001384082425,18056.000692041212,9028.000346020606,4514.000173010303,2257.0000865051516,1128.5000432525758],"groups":[{"type":"layer-group","name":"Default","visible":true,"layers":[{"type":"feature-layer","id":"layer-vyrwgp22","name":"cntry02-900913","source":{"type":"shapefile-feature-source","name":"USStates","projection":{"from":{"unit":"unknown"},"to":{"unit":"unknown"}},"flag":"rs","filePath":"src/data/cntry02-900913.shp"},"styles":[{"visible":true,"id":"style-k9dnjzab","type":"fill-style","name":"Fill Style","maximumScale":10000000000,"minimumScale":0,"lineWidth":1,"fillStyle":"rgba(228, 221, 158, 0.48)","strokeStyle":"#5c340b"}],"minimumScale":0,"maximumScale":10000000000,"visible":true}]}]}`
        };

        console.debug('Inserting new map.', firstMap);
        await repository.insert(firstMap);
        console.debug(`New map ${firstMap.name} created.`);
    }
}