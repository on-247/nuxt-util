const logger = {
  log(...objs: any[]) {
    console.log('[DEBUG] ', ...objs)
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