export enum TOKEN_TYPE {
  S,
  COMMENTS,
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

  COLON,
  SEMICOLON,
  COMMA,
  LEFT_BRACE,
  RIGHT_BRACE,
  LEFT_CURLY_BRACE,
  RIGHT_CURLY_BRACE,
  UNKNOW
};

export interface TOKEN {
  type: TOKEN_TYPE;
  value: string;
};

export interface RULE {
  re: string;
  token: TOKEN_TYPE;
}
