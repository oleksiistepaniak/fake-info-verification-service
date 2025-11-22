export type TObjectKey = string | number | symbol;
export type TAnyObject = Record<TObjectKey, unknown>;

export function isObjectNotNull<T extends TAnyObject>(
  value: unknown,
): value is Exclude<T, null> {
  return typeof value === 'object' && value !== null;
}
