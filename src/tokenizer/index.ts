import Lexer from 'lex';
import rules from './rules';
import { TOKEN, TOKEN_TYPE } from '../types';

let index = 0;
let row = 1;
let col = 1;
const tokens: TOKEN[] = [];

const lexer = new Lexer((char) => {
  throw new Error(`Unexpected character at row ${row}, col ${col}: ${char}`);
});

rules.forEach((rule) => {
  const createToken = ((r) => {
    return (yytext: string) => {
      tokens.push({
        type: r.token,
        value: yytext
      });
    };
  })(rule);

  lexer.addRule(new RegExp(rule.re, 'i'), createToken);
});

lexer.addRule(/./, (yytext: string) => {
  let tokenType = TOKEN_TYPE.UNKNOW;

  switch (yytext) {
    case ':': tokenType = TOKEN_TYPE.COLON; break;
    case ';': tokenType = TOKEN_TYPE.SEMICOLON; break;
    case ',': tokenType = TOKEN_TYPE.COMMA; break;
    case '(': tokenType = TOKEN_TYPE.LEFT_BRACE; break;
    case ')': tokenType = TOKEN_TYPE.RIGHT_BRACE; break;
    case '[': tokenType = TOKEN_TYPE.LEFT_SQUARE_BRACE; break;
    case ']': tokenType = TOKEN_TYPE.RIGHT_SQUARE_BRACE; break;
    case '{': tokenType = TOKEN_TYPE.LEFT_CURLY_BRACE; break;
    case '}': tokenType = TOKEN_TYPE.RIGHT_CURLY_BRACE; break;
    case '+': tokenType = TOKEN_TYPE.PLUS; break;
    case '-': tokenType = TOKEN_TYPE.MINUS; break;
    case '>': tokenType = TOKEN_TYPE.GREATER_THAN; break;
    case '<': tokenType = TOKEN_TYPE.LESS_THAN; break;
    case '=': tokenType = TOKEN_TYPE.EQUAL; break;
    case '.': tokenType = TOKEN_TYPE.DOT; break;
    case '*': tokenType = TOKEN_TYPE.ASTERISK; break;
    case '/': tokenType = TOKEN_TYPE.REVERSE_SOLIDUS; break;
    default:;
  }

  tokens.push({
    type: tokenType,
    value: yytext
  });
});

export function setInput(source: string): void {
  index = 0;
  lexer.input = source;
  lexer.lex();
}

export function getToken(): TOKEN {
  if (index < tokens.length) {
    return tokens[index++];
  }
  return null;
}

export function peekToken(step: number = 0): TOKEN {
  const targetIndex = index + step - 1;

  if ((targetIndex < tokens.length) && (targetIndex >= 0)) {
    return tokens[targetIndex];
  }
  return null;
}

export function peekNextNoWhiteSpaceToken(): TOKEN {
  let step = 1;
  let nextToken = peekToken(step);

  while (nextToken && nextToken.type === TOKEN_TYPE.S) {
    nextToken = peekToken(++step);
  }
  return nextToken;
}
