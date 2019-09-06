import { Migration } from "./MigrationManager";
import { MapModel } from "../models";
import { Repositories } from '../repositories/Repositories';

export class Migration_001 extends Migration {
    async migrate() {
        const repository = Repositories.maps;
        await repository.init();
        await repository.clear();

        const firstMap: MapModel = {
            name: 'Map Demo',
            description: 'This is the first demo map.',
            creator: 'Admin',
            content: '{"name":"GKMap","srs":{"projection":"GOOGLE","unit":"m"},"width":512,"height":256,"origin":"upperLeft","maximumScale":10000000000,"minimumScale":0,"scales":[591659030.6768064,295829515.3384032,147914757.6692016,73957378.8346008,36978689.4173004,18489344.7086502,9244672.3543251,4622336.17716255,2311168.088581275,1155584.0442906376,577792.0221453188,288896.0110726594,144448.0055363297,72224.00276816485,36112.001384082425,18056.000692041212,9028.000346020606,4514.000173010303,2257.0000865051516,1128.5000432525758],"groups":[{"type":"layer-group","name":"Default","visible":true,"layers":[{"type":"feature-layer","id":"layer-2knx2map","name":"USStates","source":{"type":"shapefile-feature-source","name":"USStates","projection":{"from":{"unit":"unknown"},"to":{"unit":"unknown"}},"flag":"rs","filePath":"./src/data/cntry02-900913.shp"},"styles":[{"visible":true,"id":"style-b8bpg9mq","type":"fill-style","name":"Fill Style","maximumScale":10000000000,"minimumScale":0,"lineWidth":1,"fillStyle":"yellow","strokeStyle":"blue"}],"minimumScale":0,"maximumScale":10000000000}]}]}' 
        };

        console.debug('Inserting new map.', firstMap);
        await repository.insert(firstMap);
        console.debug(`New map ${firstMap.name} created.`);
    }
}