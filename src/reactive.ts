export function observe<T>(callback: () => T): T {
  return callback();

}

export function observable<T extends object>(req: T): T {
    return req;

}