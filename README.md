# SSSA
> A toy CSS preprocessor implementation with SASS like grammar.

<p>
    <a href="LICENSE">
        <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
    </a>
    <a href="https://github.com/differui/sssa/issues">
        <img src="https://img.shields.io/github/issues/differui/sssa.svg" alt="Issues" />
    </a>
    <a href="http://standardjs.com/">
        <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="JavaScript Style Guide" />
    </ahttp->
    <a href="https://npmjs.org/package/sssa">
        <img src="https://img.shields.io/npm/v/sssa.svg?style=flat-squar" alt="NPM" />
    </a>
</p>

## Usage

**CLI**

```bash
npm i sssa -g

# examples
sssa --help
cat file.sssa | sssa
echo '.a { .b { color: red; } }' | sssa
```

**NodeJS**

```js
import { compile } from 'sssa';

const {
  tokens,
  ast,
  code,
} = compile('b {}', opts);
```

## Options

+ `opts.scan` Only proceed tokenize and return tokens;
+ `opts.parse` Proceed tokenize and generate corresponding ast;
+ `opts.transform` Transform SSSA ast to CSS ast;

## Develop

```js
# install deps
npm install

# build app
npm run build

# build & watch app
npm run watch

# build & launch app
npm run start

# run unit test
npm run test
```

## License

&copy; [BinRui Guan](mailto:differui@gmail.com)
