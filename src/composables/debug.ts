export const useLog = (msg: any, ...objs: any[]) => {
  console.log(msg, ...objs);
}

export const useLogError = (msg: any, ...objs: any[]) => {
  console.error(msg, ...objs);
}