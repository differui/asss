export enum TOKEN_TYPE {
  S,
  COMMENTS,
  BAD_COMMENTS,
  INCLUDES,
  DASHMATCH,
  STRING,
  BAD_STRING,
  IDENT,
  HASH,
  IMPORTANT_SYM,
  EMS,
  EXS,
  LENGTH,
  ANGLE,
  TIME,
  FREQ,
  DIMENSION,
  PERCENTAGE,
  NUMBER,
  URI,
  BAD_URI,
  FUNCTION,

  // marks
  COLON,
  SEMICOLON,
  COMMA,
  LEFT_BRACE,
  RIGHT_BRACE,
  LEFT_CURLY_BRACE,
  RIGHT_CURLY_BRACE,
  LEFT_SQUARE_BRACE,
  RIGHT_SQUARE_BRACE,
  PLUS,
  MINUS,
  GREATER_THAN,
  LESS_THAN,
  EQUAL,
  DOT,
  ASTERISK,
  REVERSE_SOLIDUS,
  UNKNOW
};

export enum NODE_TYPE {
  ROOT,
  BLOCK,
  ELEMENT
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
