import { IS_WEB_WORKER_ENV } from '@utils';
import { createSystem } from './sys/rindo-sys';
import { createWorkerMessageHandler } from './worker/worker-thread';
import { initWebWorkerThread } from './sys/worker/web-worker-thread';

if (IS_WEB_WORKER_ENV) {
  initWebWorkerThread(createWorkerMessageHandler(createSystem()));
}

export { compile, compileSync, transpile, transpileSync } from './transpile';
export { createCompiler } from './compiler';
export { createPrerenderer } from './prerender/prerender-main';
export { createSystem } from './sys/rindo-sys';
export { createWorkerContext } from './worker/worker-thread';
export { createWorkerMessageHandler } from './worker/worker-thread';
export { dependencies } from './sys/dependencies.json';
export { loadConfig } from './config/load-config';
export { optimizeCss } from './optimize/optimize-css';
export { optimizeJs } from './optimize/optimize-js';
export { path } from './sys/modules/path';
export { version, versions, vermoji, buildId } from '../version';
