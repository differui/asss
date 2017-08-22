import { parse } from './parser';

export function compile(source) {
  return parse(source);
}
