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

function compile(source: string, opts: COMPILER_OPTIONS): void | COMPILE_RESULT {
  if (opts.scan) {
    return {
      tokens: tokenize(source),
    };
  } else if (opts.parse) {
    const { ast } = parse(source);

    if (ast) {
      return {
        ast,
      };
    }
  } else if (opts.transform) {
    const { ast } = parse(source);

    if (ast) {
      return {
        ast: transform(ast),
      };
    }
  } else {
    const { ast } = parse(source);

    if (ast) {
      return {
        code: generate(transform(ast), {
          indent: 2,
        }),
      };
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
