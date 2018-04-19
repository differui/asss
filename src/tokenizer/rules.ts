import * as RE from './regexps';

const rules: RULE[] = [
  {
    re: RE.s,
    token: 'S',
  },
  {
    re: '\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\/',
    token: 'COMMENTS',
  },
  {
    re: RE.badcomment,
    token: 'BAD_COMMENTS',
  },
  {
    re: '~=',
    token: 'INCLUDES',
  },
  {
    re: '\\|=',
    token: 'DASHMATCH',
  },
  {
    re: RE.string,
    token: 'STRING',
  },
  {
    re: RE.badstring,
    token: 'BAD_STRING',
  },
  {
    re: RE.ident,
    token: 'IDENT',
  },
  {
    re: `#(?:${RE.name})`,
    token: 'HASH',
  },
  {
    re: `&(?:${RE.name})?`,
    token: 'AMPERSAND',
  },
  {
    re: `\\^(?:${RE.name})?`,
    token: 'CARET',
  },
  {
    re: `!((?:${RE.w})|(?:${RE.comment}))*(?:${RE.I})(?:${RE.M})(?:${RE.P})(?:${RE.O})(?:${RE.R})(?:${RE.T})(?:${RE.A})(?:${RE.N})(?:${RE.T})`,
    token: 'IMPORTANT_SYM',
  },
  {
    re: `(?:${RE.num})(?:${RE.E})(?:${RE.M})`,
    token: 'EMS',
  },
  {
    re: `(?:${RE.num})(?:${RE.E})(?:${RE.X})`,
    token: 'EXS',
  },
  {
    re: `(?:${RE.num})(?:${RE.P})(?:${RE.X})`,
    token: 'LENGTH',
  },
  {
    re: `(?:${RE.num})(?:${RE.C})(?:${RE.M})`,
    token: 'LENGTH',
  },
  {
    re: `(?:${RE.num})(?:${RE.M})(?:${RE.M})`,
    token: 'LENGTH',
  },
  {
    re: `(?:${RE.num})(?:${RE.I})(?:${RE.N})`,
    token: 'LENGTH',
  },
  {
    re: `(?:${RE.num})(?:${RE.P})(?:${RE.T})`,
    token: 'LENGTH',
  },
  {
    re: `(?:${RE.num})(?:${RE.P})(?:${RE.C})`,
    token: 'LENGTH',
  },
  {
    re: `(?:${RE.D})(?:${RE.E})(?:${RE.G})`,
    token: 'ANGLE',
  },
  {
    re: `(?:${RE.R})(?:${RE.A})(?:${RE.D})`,
    token: 'ANGLE',
  },
  {
    re: `(?:${RE.G})(?:${RE.R})(?:${RE.A})(?:${RE.D})`,
    token: 'ANGLE',
  },
  {
    re: `(?:${RE.M})(?:${RE.S})`,
    token: 'TIME',
  },
  {
    re: RE.S,
    token: 'TIME',
  },
  {
    re: `(?:${RE.H})(?:${RE.Z})`,
    token: 'FREQ',
  },
  {
    re: `(?:${RE.K})(?:${RE.H})(?:${RE.Z})`,
    token: 'FREQ',
  },
  {
    re: `(?:${RE.num})(?:${RE.ident})`,
    token: 'DIMENSION',
  },
  {
    re: `(?:${RE.num})%`,
    token: 'PERCENTAGE',
  },
  {
    re: RE.num,
    token: 'NUMBER',
  },
  {
    re: `url\\((?:${RE.w})(?:${RE.string})(?:${RE.w})\\)`,
    token: 'URI',
  },
  {
    re: `url\\((?:${RE.w})(?:${RE.url})(?:${RE.w})\\)`,
    token: 'URI',
  },
  {
    re: RE.baduri,
    token: 'BAD_URI',
  },
  {
    re: `(?:${RE.ident})\\(`,
    token: 'FUNCTION',
  }
];

export default rules;
