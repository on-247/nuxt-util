import { useRuntimeConfig } from 'nuxt/app';

const logger = {
  /** @deprecated */
  log(...objs: any[]) {
    console.log('[DEBUG] (deprecated) ', ...objs)
  },
  debug(...objs: any[]) {
    if (!useRuntimeConfig().public?.debug) {
      return;
    }
    console.debug('[DEBUG]', ...objs)
  },
  info(...objs: any[]) {
    console.log('[INFO] ', ...objs)
  },
  warn(...objs: any[]) {
    console.warn('[WARN] ', ...objs)
  },
  error(...objs: any[]) {
    console.error('[ERROR] ', ...objs)
  }
}

export const useLogger = () => {
  return logger;
}

/** @deprecated */
export const useLog = (msg: any, ...objs: any[]) => {
  return console;
}

/** @deprecated */
export const useLogError = (msg: any, ...objs: any[]) => {
  console.error(msg, ...objs);
}