import { COMPILER_OPTIONS, TOKEN, STYLESHEET_NODE } from '../types';
import { setInput, getToken } from './tokenizer';
import { parse } from './parser';
import { transform } from './transformer';
import { generate } from './generator';

function tokenize(source: string): TOKEN[] {
  const tokens: TOKEN[] = [];
  let token: void | TOKEN;

  setInput(source);
  token = getToken();
  while (token) {
    tokens.push(token);
    token = getToken();
  }
  return tokens;
}

function compile(source: string, opts: COMPILER_OPTIONS): void | TOKEN[] | STYLESHEET_NODE | string {
  if (opts.scan) {
    return tokenize(source)
  } else if (opts.parse) {
    return parse(source);
  } else if (opts.transform) {
    const ast = parse(source);

    if (ast) {
      return transform(ast);
    }
  } else {
    const ast = parse(source);

    if (ast) {
      return generate(transform(ast), {
        indent: 2,
      });
    }
  }
}

export {
  tokenize,
  parse,
  transform,
  generate,
  compile,
}
