import { _arrayBufferToString } from './string.utils';

export const normalize = (input: Record<string, any>) => {
  const obj = { ...input };
  for (const property in obj) {
    if (obj.hasOwnProperty(property)) {
      if (obj[property] instanceof Uint8Array) {
        obj[property] = _arrayBufferToString(obj[property]);
      } else if (typeof obj[property] === 'bigint') {
        obj[property] = obj[property]?.toString();
      } else if (Array.isArray(obj[property])) {
        obj[property] = obj[property].map((item: any) => normalize(item));
      } else if (typeof obj[property] === 'object') {
        obj[property] = normalize(obj[property]);
      }
    }
  }
  return obj;
};
