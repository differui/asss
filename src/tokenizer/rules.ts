import * as RE from './regexps';
import { TOKEN_TYPE, RULE } from '../types';

const rules: RULE[] = [
  {
    re: RE.s,
    token: TOKEN_TYPE.S,
  },
  {
    re: '\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\/',
    token: TOKEN_TYPE.COMMENTS
  },
  {
    re: RE.badcomment,
    token: TOKEN_TYPE.BAD_COMMENTS
  },
  {
    re: '~=',
    token: TOKEN_TYPE.INCLUDES
  },
  {
    re: '\\|=',
    token: TOKEN_TYPE.DASHMATCH
  },
  {
    re: RE.string,
    token: TOKEN_TYPE.STRING
  },
  {
    re: RE.badstring,
    token: TOKEN_TYPE.BAD_STRING
  },
  {
    re: RE.ident,
    token: TOKEN_TYPE.IDENT
  },
  {
    re: `#(?:${RE.name})`,
    token: TOKEN_TYPE.HASH
  },
  {
    re: `&(?:${RE.name})?`,
    token: TOKEN_TYPE.AMPERSAND
  },
  {
    re: `\\^(?:${RE.name})?`,
    token: TOKEN_TYPE.CARET
  },
  {
    re: `!((?:${RE.w})|(?:${RE.comment}))*(?:${RE.I})(?:${RE.M})(?:${RE.P})(?:${RE.O})(?:${RE.R})(?:${RE.T})(?:${RE.A})(?:${RE.N})(?:${RE.T})`,
    token: TOKEN_TYPE.IMPORTANT_SYM
  },
  {
    re: `(?:${RE.num})(?:${RE.E})(?:${RE.M})`,
    token: TOKEN_TYPE.EMS
  },
  {
    re: `(?:${RE.num})(?:${RE.E})(?:${RE.X})`,
    token: TOKEN_TYPE.EXS
  },
  {
    re: `(?:${RE.num})(?:${RE.P})(?:${RE.X})`,
    token: TOKEN_TYPE.LENGTH
  },
  {
    re: `(?:${RE.num})(?:${RE.C})(?:${RE.M})`,
    token: TOKEN_TYPE.LENGTH
  },
  {
    re: `(?:${RE.num})(?:${RE.M})(?:${RE.M})`,
    token: TOKEN_TYPE.LENGTH
  },
  {
    re: `(?:${RE.num})(?:${RE.I})(?:${RE.N})`,
    token: TOKEN_TYPE.LENGTH
  },
  {
    re: `(?:${RE.num})(?:${RE.P})(?:${RE.T})`,
    token: TOKEN_TYPE.LENGTH
  },
  {
    re: `(?:${RE.num})(?:${RE.P})(?:${RE.C})`,
    token: TOKEN_TYPE.LENGTH
  },
  {
    re: `(?:${RE.D})(?:${RE.E})(?:${RE.G})`,
    token: TOKEN_TYPE.ANGLE
  },
  {
    re: `(?:${RE.R})(?:${RE.A})(?:${RE.D})`,
    token: TOKEN_TYPE.ANGLE
  },
  {
    re: `(?:${RE.G})(?:${RE.R})(?:${RE.A})(?:${RE.D})`,
    token: TOKEN_TYPE.ANGLE
  },
  {
    re: `(?:${RE.M})(?:${RE.S})`,
    token: TOKEN_TYPE.TIME
  },
  {
    re: RE.S,
    token: TOKEN_TYPE.TIME
  },
  {
    re: `(?:${RE.H})(?:${RE.Z})`,
    token: TOKEN_TYPE.FREQ
  },
  {
    re: `(?:${RE.K})(?:${RE.H})(?:${RE.Z})`,
    token: TOKEN_TYPE.FREQ
  },
  {
    re: `(?:${RE.num})(?:${RE.ident})`,
    token: TOKEN_TYPE.DIMENSION
  },
  {
    re: `(?:${RE.num})%`,
    token: TOKEN_TYPE.PERCENTAGE
  },
  {
    re: RE.num,
    token: TOKEN_TYPE.NUMBER
  },
  {
    re: `url\\((?:${RE.w})(?:${RE.string})(?:${RE.w})\\)`,
    token: TOKEN_TYPE.URI
  },
  {
    re: `url\\((?:${RE.w})(?:${RE.url})(?:${RE.w})\\)`,
    token: TOKEN_TYPE.URI
  },
  {
    re: RE.baduri,
    token: TOKEN_TYPE.BAD_URI
  },
  {
    re: `(?:${RE.ident})\\(`,
    token: TOKEN_TYPE.FUNCTION
  }
];

export default rules;
