import config from './config/config';
import { serve } from './worker';
import { serveCluster } from './cluster';

if (config.CLUSTER_ON) {
    serveCluster();
} else {
    serve();
}