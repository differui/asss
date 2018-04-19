import { setInput, getToken, peekNextNoWhiteSpaceToken } from '../tokenizer';
import { makeStylesheetNode, makeRuleNode } from '../helper/node';

let token: TOKEN;

export function parse(source: string): PARSE_RESULT {
  setInput(source);
  token = getToken() as TOKEN;
  if (token) {
    return {
      ast: stylesheet(),
    }
  }
  return {};
}

export function stylesheet(): STYLESHEET_NODE {
  const rootNode: STYLESHEET_NODE = makeStylesheetNode();

  eatWhiteSpace();
  while (test(['IDENT', 'HASH', 'DOT', 'LEFT_SQUARE_BRACE', 'COLON'])) {
    rootNode.children.push(rule());
    eatWhiteSpace();
  }
  return rootNode;
}

export function rule(): RULE_NODE {
  const ruleNode: RULE_NODE = makeRuleNode();

  ruleNode.selectors = selectors();
  match('LEFT_CURLY_BRACE');
  eatWhiteSpace();
  while (test(['AMPERSAND', 'CARET', 'IDENT', 'SEMICOLON', 'DOT', 'HASH', 'LEFT_SQUARE_BRACE', 'COLON'])) {
    const nextToken = peekNextNoWhiteSpaceToken();

    if ((test('IDENT') && nextToken && nextToken.type === 'COLON') || test('SEMICOLON')) {
      ruleNode.declarations = ruleNode.declarations.concat(declarations());
    } else {
      ruleNode.children.push(rule());
    }
  }
  match('RIGHT_CURLY_BRACE');
  eatWhiteSpace();
  return ruleNode;
}

export function selectors(): string[] {
  let rtn: string[] = [];

  rtn.push(selector());
  while (test('COMMA')) {
    match('COMMA');
    eatWhiteSpace();
    rtn.push(selector());
  }
  return rtn;
}

export function selector(): string {
  let rtn: string;

  rtn = simpleSelector();
  if (test(['PLUS', 'GREATER_THAN'])) {
    rtn += combinator();
    rtn += selector();
  } else if (test('S')) {
    match('S');
    if (test(['PLUS', 'GREATER_THAN', 'AMPERSAND', 'CARET', 'IDENT', 'ASTERISK', 'HASH', 'DOT', 'LEFT_SQUARE_BRACE', 'COLON'])) {
      if (test(['PLUS', 'GREATER_THAN'])) {
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

  if (test(['AMPERSAND', 'CARET', 'IDENT', 'ASTERISK'])) {
    rtn = elementName();
    while (test(['HASH', 'DOT', 'LEFT_SQUARE_BRACE', 'COLON'])) {
      switch (token.type) {
        case 'HASH':
          rtn += token.value;
          match('HASH');
          break;
        case 'DOT':
          rtn += klass();
          break;
        case 'LEFT_SQUARE_BRACE':
          rtn += attrib();
          break;
        case 'COLON':
          rtn += pseudo();
          break;
        default:
      }
    }
  } else {
    rtn = '';
    do {
      switch (token.type) {
        case 'HASH':
          rtn += token.value;
          match('HASH');
          break;
        case 'DOT':
          rtn += klass();
          break;
        case 'LEFT_SQUARE_BRACE':
          rtn += attrib();
          break;
        case 'COLON':
          rtn += pseudo();
          break;
        default:
      }
    } while (test(['HASH', 'DOT', 'LEFT_SQUARE_BRACE', 'COLON']));
  }
  return rtn;
}

export function elementName(): string {
  let rtn: string;

  rtn = token.value;
  if (test('AMPERSAND')) {
    match('AMPERSAND');
  } else if (test('CARET')) {
    match('CARET');
  } else if (test('IDENT')) {
    match('IDENT');
  } else if (test('ASTERISK')) {
    match('ASTERISK');
  } else {
    error();
  }
  return rtn;
}

export function klass(): string {
  let rtn: string;

  rtn = '.';
  match('DOT');
  rtn += token.value;
  match('IDENT');
  return rtn;
}

export function attrib(): string {
  let rtn: string = '';

  rtn += '[';
  match('LEFT_SQUARE_BRACE');
  eatWhiteSpace();
  rtn += token.value;
  match('IDENT');
  eatWhiteSpace();
  if (test(['EQUAL', 'INCLUDES', 'DASHMATCH', 'S', 'IDENT', 'STRING'])) {
    if (test(['EQUAL', 'INCLUDES', 'DASHMATCH'])) {
      rtn += token.value;
      match(token.type);
    }
    eatWhiteSpace();
    if (test(['IDENT', 'STRING'])) {
      rtn += token.value;
      match(token.type);
    }
    eatWhiteSpace();
  }
  rtn += ']';
  match('RIGHT_SQUARE_BRACE');
  return rtn;
}

export function pseudo(): string {
  let rtn: string;

  rtn = ':';
  match('COLON');

  const type = token.type; // depressed ts error

  switch (type) {
    case 'IDENT':
      rtn += token.value;
      match('IDENT');
      break;
    case 'FUNCTION':
      rtn += token.value;
      match('FUNCTION');
      eatWhiteSpace();
      if (token.type === 'IDENT') {
        rtn += ' ';
        rtn += token.value;
        eatWhiteSpace();
      }
      rtn += ')';
      match('RIGHT_BRACE');
      break;
    default:
      error();
  }

  return rtn;
}

export function declarations(): DECLARATION[] {
  const rtn: DECLARATION[] = [];

  if (test('IDENT')) {
    rtn.push(declaration());
  }
  while (test('SEMICOLON')) {
    match('SEMICOLON')
    eatWhiteSpace();
    const nextToken = peekNextNoWhiteSpaceToken();

    if (test('IDENT') && nextToken && nextToken.type === 'COLON') {
      rtn.push(declaration());
    }
  }
  return rtn;
}

export function declaration(): DECLARATION {
  const rtn: DECLARATION = ['', ''];

  rtn[0] = property();
  match('COLON');
  eatWhiteSpace();
  rtn[1] = expr();
  if (token.type === 'IMPORTANT_SYM') {
    rtn[1] += ' !important';
    match('IMPORTANT_SYM');
  }
  return rtn;
}

export function prio(): string {
  let rtn: string;

  rtn = token.value;
  match('IMPORTANT_SYM');
  eatWhiteSpace();
  return rtn;
}

export function operator(): string {
  const rtn: string = token.value;

  switch (token.type) {
    case 'REVERSE_SOLIDUS':
      match('REVERSE_SOLIDUS');
      break;
    case 'COMMA':
      match('COMMA');
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
    case 'PLUS':
      match('PLUS');
      break;
    case 'GREATER_THAN':
      match('GREATER_THAN');
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
    case 'PLUS':
      match('PLUS');
      break;
    case 'MINUS':
      match('MINUS');
      break;
    default:
      error();
  }
  return rtn;
}

export function property(): string {
  const rtn: string = token.value;

  match('IDENT');
  eatWhiteSpace();
  return rtn;
}

export function expr(): string {
  let rtn: string = term();

  while (test(['REVERSE_SOLIDUS', 'COMMA', 'PLUS', 'MINUS', 'NUMBER', 'PERCENTAGE', 'LENGTH', 'EMS', 'EXS', 'ANGLE', 'TIME', 'FREQ', 'STRING', 'IDENT', 'URI', 'HASH', 'FUNCTION'])) {
    if (test(['REVERSE_SOLIDUS', 'COMMA'])) {
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

  if (test(['PLUS', 'MINUS'])) {
    rtn += unaryOperator();
  }
  if (test(['NUMBER', 'PERCENTAGE', 'LENGTH', 'EMS', 'EXS', 'ANGLE', 'TIME', 'FREQ'])) {
    rtn += token.value;
    match(token.type);
    eatWhiteSpace();
  } else if (test(['STRING', 'IDENT', 'URI'])) {
    rtn += token.value
    match(token.type);
    eatWhiteSpace();
  } else if (test('HASH')) {
    rtn += hexColor();
  } else if (test('FUNCTION')) {
    rtn += func();
  } else {
    error();
  }
  return rtn;
}

export function func(): string {
  let rtn: string;

  rtn = token.value;
  match('FUNCTION');
  eatWhiteSpace();
  rtn += expr();
  rtn += ')';
  match('RIGHT_BRACE');
  eatWhiteSpace();
  return rtn;
}

export function hexColor(): string {
  const rtn: string = token.value;

  match('HASH');
  eatWhiteSpace();
  return rtn;
}

// utils
// ====

export function eatWhiteSpace() {
  while (token && test('S')) {
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
