import { TOKEN_TYPE } from '../src/enums/tokenType';

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
