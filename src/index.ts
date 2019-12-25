import config from './config/config';
import { serve } from './worker';
import { serveCluster } from './cluster';

if (config.CLUSTER_ON) {
    console.log('Cluster mode.');
    serveCluster();
} else {
    console.log('Single process mode.')
    serve();
}