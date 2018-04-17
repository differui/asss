#!/usr/bin/env node
'use strict';

const meow = require('meow');
const getStdin = require('get-stdin');
const compile = require('../').compile;

const cli = meow(`
    Usage
      $ sssa [options] [file ...]

    Options
      -s, --scan      Output tokens
      -p, --parse     Output source code ast
      -t, --transform Output target code ast

    Examples
      $ sssa file.sssa
      $ sssa -s file.sssa
      $ sssa -p file.sssa
      $ cat source.sssa | sssa > dest.css
`, {
  boolean: [
    'scan',
    'parse',
    'transform'
  ],
  alias: {
    s: 'scan',
    p: 'parse',
    t: 'transform'
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
      parse: cli.flags.parse,
      transform: cli.flags.transform
    });

    console.log(typeof result === 'string' ? result : JSON.stringify(result, undefined, 2));
  });
}

run();
