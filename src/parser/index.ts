import { TOKEN_TYPE } from '../enums/tokenType';
import { TOKEN, DECLARATION, STYLESHEET_NODE, RULE_NODE } from '../../types';
import { setInput, getToken, peekNextNoWhiteSpaceToken } from '../tokenizer';
import { makeStylesheetNode, makeRuleNode } from '../helper/node';

let token: TOKEN;

export function parse(source: string): void | STYLESHEET_NODE {
  setInput(source);
  token = getToken() as TOKEN;
  if (token) {
    return stylesheet();
  }
}

export function stylesheet(): STYLESHEET_NODE {
  const rootNode: STYLESHEET_NODE = makeStylesheetNode();

  eatWhiteSpace();
  while (test([TOKEN_TYPE.IDENT, TOKEN_TYPE.HASH, TOKEN_TYPE.DOT, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON])) {
    rootNode.children.push(rule());
    eatWhiteSpace();
  }
  return rootNode;
}

export function rule(): RULE_NODE {
  const ruleNode: RULE_NODE = makeRuleNode();

  ruleNode.selectors = selectors();
  match(TOKEN_TYPE.LEFT_CURLY_BRACE);
  eatWhiteSpace();
  while (test([TOKEN_TYPE.AMPERSAND, TOKEN_TYPE.CARET, TOKEN_TYPE.IDENT, TOKEN_TYPE.SEMICOLON, TOKEN_TYPE.DOT, TOKEN_TYPE.HASH, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON])) {
    const nextToken = peekNextNoWhiteSpaceToken();

    if ((test(TOKEN_TYPE.IDENT) && nextToken && nextToken.type === TOKEN_TYPE.COLON) || test(TOKEN_TYPE.SEMICOLON)) {
      ruleNode.declarations = ruleNode.declarations.concat(declarations());
    } else {
      ruleNode.children.push(rule());
    }
  }
  match(TOKEN_TYPE.RIGHT_CURLY_BRACE);
  eatWhiteSpace();
  return ruleNode;
}

export function selectors(): string[] {
  let rtn: string[] = [];

  rtn.push(selector());
  while (test(TOKEN_TYPE.COMMA)) {
    match(TOKEN_TYPE.COMMA);
    eatWhiteSpace();
    rtn.push(selector());
  }
  return rtn;
}

export function selector(): string {
  let rtn: string;

  rtn = simpleSelector();
  if (test([TOKEN_TYPE.PLUS, TOKEN_TYPE.GREATER_THAN])) {
    rtn += combinator();
    rtn += selector();
  } else if (test(TOKEN_TYPE.S)) {
    match(TOKEN_TYPE.S);
    if (test([TOKEN_TYPE.PLUS, TOKEN_TYPE.GREATER_THAN, TOKEN_TYPE.AMPERSAND, TOKEN_TYPE.CARET, TOKEN_TYPE.IDENT, TOKEN_TYPE.ASTERISK, TOKEN_TYPE.HASH, TOKEN_TYPE.DOT, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON])) {
      if (test([TOKEN_TYPE.PLUS, TOKEN_TYPE.GREATER_THAN])) {
        rtn += ' ';
        rtn += combinator();
      }
      rtn += ' ';
      rtn += selector();
    }
  }
  return rtn;
}

export function simpleSelector(): string {
  let rtn: string;

  if (test([TOKEN_TYPE.AMPERSAND, TOKEN_TYPE.CARET, TOKEN_TYPE.IDENT, TOKEN_TYPE.ASTERISK])) {
    rtn = elementName();
    while (test([TOKEN_TYPE.HASH, TOKEN_TYPE.DOT, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON])) {
      switch (token.type) {
        case TOKEN_TYPE.HASH:
          rtn += token.value;
          match(TOKEN_TYPE.HASH);
          break;
        case TOKEN_TYPE.DOT:
          rtn += klass();
          break;
        case TOKEN_TYPE.LEFT_SQUARE_BRACE:
          rtn += attrib();
          break;
        case TOKEN_TYPE.COLON:
          rtn += pseudo();
          break;
        default:
      }
    }
  } else {
    rtn = '';
    do {
      switch (token.type) {
        case TOKEN_TYPE.HASH:
          rtn += token.value;
          match(TOKEN_TYPE.HASH);
          break;
        case TOKEN_TYPE.DOT:
          rtn += klass();
          break;
        case TOKEN_TYPE.LEFT_SQUARE_BRACE:
          rtn += attrib();
          break;
        case TOKEN_TYPE.COLON:
          rtn += pseudo();
          break;
        default:
      }
    } while (test([TOKEN_TYPE.HASH, TOKEN_TYPE.DOT, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON]));
  }
  return rtn;
}

export function elementName(): string {
  let rtn: string;

  rtn = token.value;
  if (test(TOKEN_TYPE.AMPERSAND)) {
    match(TOKEN_TYPE.AMPERSAND);
  } else if (test(TOKEN_TYPE.CARET)) {
    match(TOKEN_TYPE.CARET);
  } else if (test(TOKEN_TYPE.IDENT)) {
    match(TOKEN_TYPE.IDENT);
  } else if (test(TOKEN_TYPE.ASTERISK)) {
    match(TOKEN_TYPE.ASTERISK);
  } else {
    error();
  }
  return rtn;
}

export function klass(): string {
  let rtn: string;

  rtn = '.';
  match(TOKEN_TYPE.DOT);
  rtn += token.value;
  match(TOKEN_TYPE.IDENT);
  return rtn;
}

export function attrib(): string {
  let rtn: string = '';

  rtn += '[';
  match(TOKEN_TYPE.LEFT_SQUARE_BRACE);
  eatWhiteSpace();
  rtn += token.value;
  match(TOKEN_TYPE.IDENT);
  eatWhiteSpace();
  if (test([TOKEN_TYPE.EQUAL, TOKEN_TYPE.INCLUDES, TOKEN_TYPE.DASHMATCH, TOKEN_TYPE.S, TOKEN_TYPE.IDENT, TOKEN_TYPE.STRING])) {
    if (test([TOKEN_TYPE.EQUAL, TOKEN_TYPE.INCLUDES, TOKEN_TYPE.DASHMATCH])) {
      rtn += token.value;
      match(token.type);
    }
    eatWhiteSpace();
    if (test([TOKEN_TYPE.IDENT, TOKEN_TYPE.STRING])) {
      rtn += token.value;
      match(token.type);
    }
    eatWhiteSpace();
  }
  rtn += ']';
  match(TOKEN_TYPE.RIGHT_SQUARE_BRACE);
  return rtn;
}

export function pseudo(): string {
  let rtn: string;

  rtn = ':';
  match(TOKEN_TYPE.COLON);

  const type = token.type; // depressed ts error

  switch (type) {
    case TOKEN_TYPE.IDENT:
      rtn += token.value;
      match(TOKEN_TYPE.IDENT);
      break;
    case TOKEN_TYPE.FUNCTION:
      rtn += token.value;
      match(TOKEN_TYPE.FUNCTION);
      eatWhiteSpace();
      if (token.type === TOKEN_TYPE.IDENT) {
        rtn += ' ';
        rtn += token.value;
        eatWhiteSpace();
      }
      rtn += ')';
      match(TOKEN_TYPE.RIGHT_BRACE);
      break;
    default:
      error();
  }

  return rtn;
}

export function declarations(): DECLARATION[] {
  const rtn: DECLARATION[] = [];

  if (test(TOKEN_TYPE.IDENT)) {
    rtn.push(declaration());
  }
  while (test(TOKEN_TYPE.SEMICOLON)) {
    match(TOKEN_TYPE.SEMICOLON)
    eatWhiteSpace();
    const nextToken = peekNextNoWhiteSpaceToken();

    if (test(TOKEN_TYPE.IDENT) && nextToken && nextToken.type === TOKEN_TYPE.COLON) {
      rtn.push(declaration());
    }
  }
  return rtn;
}

export function declaration(): DECLARATION {
  const rtn: DECLARATION = ['', ''];

  rtn[0] = property();
  match(TOKEN_TYPE.COLON);
  eatWhiteSpace();
  rtn[1] = expr();
  if (token.type === TOKEN_TYPE.IMPORTANT_SYM) {
    rtn[1] += ' !important';
    match(TOKEN_TYPE.IMPORTANT_SYM);
  }
  return rtn;
}

export function prio(): string {
  let rtn: string;

  rtn = token.value;
  match(TOKEN_TYPE.IMPORTANT_SYM);
  eatWhiteSpace();
  return rtn;
}

export function operator(): string {
  const rtn: string = token.value;

  switch (token.type) {
    case TOKEN_TYPE.REVERSE_SOLIDUS:
      match(TOKEN_TYPE.REVERSE_SOLIDUS);
      break;
    case TOKEN_TYPE.COMMA:
      match(TOKEN_TYPE.COMMA);
      break;
    default:
      error();
  }
  eatWhiteSpace();
  return rtn;
}

export function combinator(): string {
  const rtn: string = token.value;

  switch (token.type) {
    case TOKEN_TYPE.PLUS:
      match(TOKEN_TYPE.PLUS);
      break;
    case TOKEN_TYPE.GREATER_THAN:
      match(TOKEN_TYPE.GREATER_THAN);
      break;
    default:
      error();
  }
  eatWhiteSpace();
  return rtn;
}

export function unaryOperator(): string {
  const rtn: string = token.value;

  switch (token.type) {
    case TOKEN_TYPE.PLUS:
      match(TOKEN_TYPE.PLUS);
      break;
    case TOKEN_TYPE.MINUS:
      match(TOKEN_TYPE.MINUS);
      break;
    default:
      error();
  }
  return rtn;
}

export function property(): string {
  const rtn: string = token.value;

  match(TOKEN_TYPE.IDENT);
  eatWhiteSpace();
  return rtn;
}

export function expr(): string {
  let rtn: string = term();

  while (test([TOKEN_TYPE.REVERSE_SOLIDUS, TOKEN_TYPE.COMMA, TOKEN_TYPE.PLUS, TOKEN_TYPE.MINUS, TOKEN_TYPE.NUMBER, TOKEN_TYPE.PERCENTAGE, TOKEN_TYPE.LENGTH, TOKEN_TYPE.EMS, TOKEN_TYPE.EXS, TOKEN_TYPE.ANGLE, TOKEN_TYPE.TIME, TOKEN_TYPE.FREQ, TOKEN_TYPE.STRING, TOKEN_TYPE.IDENT, TOKEN_TYPE.URI, TOKEN_TYPE.HASH, TOKEN_TYPE.FUNCTION])) {
    if (test([TOKEN_TYPE.REVERSE_SOLIDUS, TOKEN_TYPE.COMMA])) {
      rtn += operator();
    } else {
      rtn += rtn ? ' ' : rtn;
    }
    rtn += term();
  }
  return rtn;
}

export function term(): string {
  let rtn: string = '';

  if (test([TOKEN_TYPE.PLUS, TOKEN_TYPE.MINUS])) {
    rtn += unaryOperator();
  }
  if (test([TOKEN_TYPE.NUMBER, TOKEN_TYPE.PERCENTAGE, TOKEN_TYPE.LENGTH, TOKEN_TYPE.EMS, TOKEN_TYPE.EXS, TOKEN_TYPE.ANGLE, TOKEN_TYPE.TIME, TOKEN_TYPE.FREQ])) {
    rtn += token.value;
    match(token.type);
    eatWhiteSpace();
  } else if (test([TOKEN_TYPE.STRING, TOKEN_TYPE.IDENT, TOKEN_TYPE.URI])) {
    rtn += token.value
    match(token.type);
    eatWhiteSpace();
  } else if (test(TOKEN_TYPE.HASH)) {
    rtn += hexColor();
  } else if (test(TOKEN_TYPE.FUNCTION)) {
    rtn += func();
  } else {
    error();
  }
  return rtn;
}

export function func(): string {
  let rtn: string;

  rtn = token.value;
  match(TOKEN_TYPE.FUNCTION);
  eatWhiteSpace();
  rtn += expr();
  rtn += ')';
  match(TOKEN_TYPE.RIGHT_BRACE);
  eatWhiteSpace();
  return rtn;
}

export function hexColor(): string {
  const rtn: string = token.value;

  match(TOKEN_TYPE.HASH);
  eatWhiteSpace();
  return rtn;
}

// utils
// ====

export function eatWhiteSpace() {
  while (token && test(TOKEN_TYPE.S)) {
    next();
  }
}

export function test(expected: TOKEN_TYPE | TOKEN_TYPE[]): boolean {
  if (!token) {
    return false;
  }
  if (Array.isArray(expected)) {
    return expected.indexOf(token.type) > -1;
  } else {
    return token.type === expected;
  }
}

export function next(): void {
  token = getToken() as TOKEN;
}

export function match(expected: TOKEN_TYPE): void {
  if (test(expected)) {
    next()
  } else {
    error();
  }
}

export function error(): never {
  throw new Error('parse error');
}
