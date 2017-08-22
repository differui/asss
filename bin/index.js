#!/usr/bin/env node
'use strict';

const meow = require('meow');
const getStdin = require('get-stdin');
const compile = require('../').compile;

const cli = meow(`
    Usage
      $ sssa [options] [file ...]

    Options
      -s, --scan   Scan only and output tokens
      -p, --parse  Parse only and output ast

    Examples
      $ sssa file.sssa
      $ sssa -s file.sssa
      $ sssa -p file.sssa
      $ cat source.sssa | sssa > dest.css
`, {
  boolean: [
    'scan',
    'parse'
  ],
  alias: {
    s: 'scan',
    p: 'parse'
  }
});

function run() {
  getStdin().then(function (source) {
    if (!source) {
      console.log(cli.help);
      return;
    }

    const result = compile(source, {
      scan: cli.flags.scan,
      parse: cli.flags.parse
    });

    console.log(typeof result === 'string' ? result : JSON.stringify(result, null, 2));
  });
}

run();
