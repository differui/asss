import { setInput, getToken } from './tokenizer';
import { parse } from './parser';
import { transform } from './transformer';
import { COMPILER_OPTIONS, TOKEN } from './types';

export function compile(source, opts: COMPILER_OPTIONS) {
  if (opts.scan) {
    const tokens: TOKEN[] = [];
    let token: TOKEN;

    setInput(source);
    token = getToken();
    while (token) {
      tokens.push(token);
      token = getToken();
    }
    return tokens;
  } else if (opts.parse) {
    return parse(source);
  } else if (opts.transform) {
    return transform(parse(source));
  } else {
    return source;
  }
}
