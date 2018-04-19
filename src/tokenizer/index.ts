import Lexer from 'lex';
import rules from './rules';

let index: number = 0;
let row: number = 1;
let col: number = 1;
const tokens: TOKEN[] = [];

const lexer = new Lexer((char) => {
  throw new Error(`Unexpected character at row ${row}, col ${col}: ${char}`);
});

rules.forEach((rule) => {
  const createToken = ((r) => {
    return (yytext: string) => {
      tokens.push({
        type: r.token,
        value: yytext,
      });
    };
  })(rule);

  lexer.addRule(new RegExp(rule.re, 'i'), createToken);
});

lexer.addRule(/./, (yytext: string) => {
  let tokenType: TOKEN_TYPE = 'UNKNOWN';

  switch (yytext) {
    case ':': tokenType = 'COLON'; break;
    case ';': tokenType = 'SEMICOLON'; break;
    case ',': tokenType = 'COMMA'; break;
    case '(': tokenType = 'LEFT_BRACE'; break;
    case ')': tokenType = 'RIGHT_BRACE'; break;
    case '[': tokenType = 'LEFT_SQUARE_BRACE'; break;
    case ']': tokenType = 'RIGHT_SQUARE_BRACE'; break;
    case '{': tokenType = 'LEFT_CURLY_BRACE'; break;
    case '}': tokenType = 'RIGHT_CURLY_BRACE'; break;
    case '+': tokenType = 'PLUS'; break;
    case '-': tokenType = 'MINUS'; break;
    case '>': tokenType = 'GREATER_THAN'; break;
    case '<': tokenType = 'LESS_THAN'; break;
    case '=': tokenType = 'EQUAL'; break;
    case '.': tokenType = 'DOT'; break;
    case '*': tokenType = 'ASTERISK'; break;
    case '/': tokenType = 'REVERSE_SOLIDUS'; break;
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

export function getToken(): void | TOKEN {
  if (index < tokens.length) {
    return tokens[index++];
  }
}

export function peekToken(step: number = 0): void | TOKEN {
  const targetIndex = index + step - 1;

  if ((targetIndex < tokens.length) && (targetIndex >= 0)) {
    return tokens[targetIndex];
  }
}

export function peekNextNoWhiteSpaceToken(): void | TOKEN {
  let step = 1;
  let nextToken = peekToken(step);

  while (nextToken && nextToken.type === 'S') {
    nextToken = peekToken(++step);
  }
  return nextToken;
}
