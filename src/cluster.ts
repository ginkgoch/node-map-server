//TODO: In cluster mode, due to the worker process maintains its own temporary cache,
// which leads the worker service is not a pure stateless service.
// So cluster mode requires pretty restricted situation such as a immutable service which is predefined.
// I will propose a new architect to support cluster mode better later. 

import cluster, { worker } from 'cluster';
import { serve } from './worker';
import config from './config/config';

const cpuLength = config.CLUSTER_SLAVE_COUNT;
export function serveCluster() {
    if (cluster.isMaster) {
        console.log(`Master process <${process.pid}> launches.`);
        console.log(`Prepare to folk ${cpuLength} processes.`);
        
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
}

