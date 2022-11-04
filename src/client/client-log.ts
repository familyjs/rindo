import { BUILD } from '@app-data';

export const RINDO_DEV_MODE = BUILD.isTesting
  ? ['RINDO:'] // E2E testing
  : ['%crindo', 'color: white;background:#4c47ff;font-weight: bold; font-size:10px; padding:2px 6px; border-radius: 5px'];

export const consoleDevError = (...m: any[]) => console.error(...RINDO_DEV_MODE, ...m);

export const consoleDevWarn = (...m: any[]) => console.warn(...RINDO_DEV_MODE, ...m);

export const consoleDevInfo = (...m: any[]) => console.info(...RINDO_DEV_MODE, ...m);

export const consoleError = (e: any) => console.error(e);
