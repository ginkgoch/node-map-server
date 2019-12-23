//TODO: In cluster mode, due to the worker process maintains its own temporary cache,
// which leads the worker service is not a pure stateless service.
// So cluster mode requires pretty restricted situation such as a immutable service which is predefined.
// I will propose a new architect to support cluster mode better later. 

import cluster, { worker } from 'cluster';
import os from 'os';
import { serve } from './worker';

const cpuLength = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Master process <${process.pid}> launches.`);

    for (let i = 0; i < cpuLength; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker process <${worker.process.pid}> exits with signal ${signal}.`)
    });
} else {
    serve(() => {
        console.log(`Worker process <${process.pid}> launches.`);
    });
}