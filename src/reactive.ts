let customCallback: (() => void) | null = null;

export function observe<T>(callback: () => T): T {
  customCallback = callback
  return callback()
}

function isEqualArray(array1: any, array2: any) {
  if (!Array.isArray(array1) || !Array.isArray(array2)) return false;
  if (array1.length !== array2.length) return false;
  array1.sort()
  array2.sort()
  return array1.every((value, index) => value === array2[index]);
}

function isEqualObject(obj1: any, obj2: any) {
  if (Array.isArray(obj1) || Array.isArray(obj2)) return false;
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  const obj1_keys = Object.keys(obj1);
  const obj2_keys = Object.keys(obj2);
  if (obj1_keys.length !== obj2_keys.length) return false;
  return obj1_keys.every((key) => {
    if (typeof obj2[key] === 'undefined') return false;
    return Object.is(obj1[key], obj2[key]);
  })
}

export function observable(req: {[key: string]: number | object }): any {
  let timeId:  NodeJS.Timeout | null = null;
  return {
    get: (name: string) => req[name],
    set: (prop: string, value: number | object) => {
      if (req[prop] == value) return;
      const isEqualArrayValue = isEqualArray(req[prop], value);
      if (isEqualArrayValue) return;
      const isEqualObjectValue = isEqualObject(req[prop], value);
      if (isEqualObjectValue) return;
      req[prop] = value
      if (timeId) return;
      timeId = setTimeout(() => {
        customCallback?.()
        timeId = null
      }, 0)
    }
  }
}




