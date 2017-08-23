export enum TOKEN_TYPE {
  S = 'S',
  COMMENTS = 'COMMENTS',
  BAD_COMMENTS = 'BAD_COMMENTS',
  INCLUDES = 'INCLUDES',
  DASHMATCH = 'DASHMATCH',
  STRING = 'STRING',
  BAD_STRING = 'BAD_STRING',
  IDENT = 'IDENT',
  HASH = 'HASH',
  IMPORTANT_SYM = 'IMPORTANT_SYM',
  EMS = 'EMS',
  EXS = 'EXS',
  LENGTH = 'LENGTH',
  ANGLE = 'ANGLE',
  TIME = 'TIME',
  FREQ = 'FREQ',
  DIMENSION = 'DIMENSION',
  PERCENTAGE = 'PERCENTAGE',
  NUMBER = 'NUMBER',
  URI = 'URI',
  BAD_URI = 'BAD_URI',
  FUNCTION = 'FUNCTION',

  // marks
  COLON = 'COLON',
  SEMICOLON = 'SEMICOLON',
  COMMA = 'COMMA',
  LEFT_BRACE = 'LEFT_BRACE',
  RIGHT_BRACE = 'RIGHT_BRACE',
  LEFT_CURLY_BRACE = 'LEFT_CURLY_BRACE',
  RIGHT_CURLY_BRACE = 'RIGHT_CURLY_BRACE',
  LEFT_SQUARE_BRACE = 'LEFT_SQUARE_BRACE',
  RIGHT_SQUARE_BRACE = 'RIGHT_SQUARE_BRACE',
  PLUS = 'PLUS',
  MINUS = 'MINUS',
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
  EQUAL = 'EQUAL',
  DOT = 'DOT',
  ASTERISK = 'ASTERISK',
  REVERSE_SOLIDUS = 'REVERSE_SOLIDUS',
  AMPERSAND = 'AMPERSAND',
  CARET = 'CARET',
  UNKNOW = 'UNKNOW'
};

export enum NODE_TYPE {
  STYLESHEET = 'STYLESHEET',
  RULE = 'RULE'
};

export interface TOKEN {
  type: TOKEN_TYPE;
  value: string;
};

export interface NODE {
  type: NODE_TYPE;
  selectors?: string[];
  declarations?: DECLARATION[];
  children?: NODE[];
};

export interface RULE {
  re: string;
  token: TOKEN_TYPE;
};

let declaration_type: [ string, string ];
export type DECLARATION = typeof declaration_type;

export interface COMPILER_OPTIONS {
  scan?: boolean;
  parse?: boolean;
  transform?: boolean;
}
