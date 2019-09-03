import { MapsRepository } from "../repositories/MapsRepository";
import { MapModel } from "../models";

async function migrate() {
    const repository = await MapsRepository.create();
    await repository.init();

    const now = new Date().getTime();
    const firstMap: MapModel = {
        name: 'Map1',
        description: 'Hello Map',
        createAt: now,
        updateAt: now,
        creator: 'Admin',
        content: 'This is a test'
    };

    console.debug('Inserting new map.', firstMap);
    await repository.insert(firstMap);
    console.debug(`New map ${firstMap.name} created.`);
}

migrate();
