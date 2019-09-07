import supertest from 'supertest';
import { Repositories } from "../../src/repositories/Repositories";
import { Server } from 'http';
import { MapModel } from '../../src/models';
import { TestEnv } from './TestEnv';

describe('Requests', () => {
    let server: Server;

    beforeAll(async () => {
        server = await TestEnv.serve();
    });

    afterAll(async done => {
        await Repositories.close();
        server.close(() => {
            console.debug('Test server closed')
            done();
        });
    });

    it('GET Maps', async () => {
        const response = await supertest(server).get('/maps');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);
    });

    it('POST Map', async () => {
        const mapModel: MapModel = {
            name: 'Map Model 001',
            creator: 'Anonymous',
            description: 'This is a posted map test',
            content: '{}'
        };

        const response = await supertest(server).post('/maps').type('form').send(JSON.stringify(mapModel)).set('Content-Type', 'text/plain');
        expect(response.status).toBe(200);
        expect(response.body.name).toEqual('Map Model 001');
    });
});