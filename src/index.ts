import { parse } from './parser';

export default function compile(source) {
  return parse(source);
}
