declare type TOKEN_TYPE =
  'S' |
  'COMMENTS' |
  'BAD_COMMENTS' |
  'INCLUDES' |
  'DASHMATCH' |
  'STRING' |
  'BAD_STRING' |
  'IDENT' |
  'HASH' |
  'IMPORTANT_SYM' |
  'EMS' |
  'EXS' |
  'LENGTH' |
  'ANGLE' |
  'TIME' |
  'FREQ' |
  'DIMENSION' |
  'PERCENTAGE' |
  'NUMBER' |
  'URI' |
  'BAD_URI' |
  'FUNCTION' |

  // marks
  'COLON' |
  'SEMICOLON' |
  'COMMA' |
  'LEFT_BRACE' |
  'RIGHT_BRACE' |
  'LEFT_CURLY_BRACE' |
  'RIGHT_CURLY_BRACE' |
  'LEFT_SQUARE_BRACE' |
  'RIGHT_SQUARE_BRACE' |
  'PLUS' |
  'MINUS' |
  'GREATER_THAN' |
  'LESS_THAN' |
  'EQUAL' |
  'DOT' |
  'ASTERISK' |
  'REVERSE_SOLIDUS' |
  'AMPERSAND' |
  'CARET' |
  'UNKNOWN';

declare interface TOKEN {
  type: TOKEN_TYPE;
  value: string;
}

declare interface STYLESHEET_NODE {
  children: RULE_NODE[];
}

declare interface RULE_NODE {
  selectors: string[];
  declarations: DECLARATION[];
  children: RULE_NODE[];
}

declare interface RULE {
  re: string;
  token: TOKEN_TYPE;
}

declare type DECLARATION = [ string, string ];

declare interface COMPILER_OPTIONS {
  scan?: boolean;
  parse?: boolean;
  transform?: boolean;
}

declare interface GENERATOR_OPTIONS {
  indent: number;
}

declare interface COMPILE_RESULT {
  code?: string;
  ast?: STYLESHEET_NODE;
  tokens?: TOKEN[];
}

declare interface PARSE_RESULT {
  ast?: STYLESHEET_NODE;
}

declare module 'sssa' {
  export function tokenize(source: string): TOKEN[];
  export function parse(source: string): STYLESHEET_NODE;
  export function transform(ast: STYLESHEET_NODE): STYLESHEET_NODE;
  export function generate(ast: STYLESHEET_NODE, opts: GENERATOR_OPTIONS): string;
  export function compile(source: string, opts: COMPILER_OPTIONS): string;
}
