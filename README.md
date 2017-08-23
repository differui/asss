# SSSA
> A toy CSS preprocessor implementation with SASS like grammar.

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

console.log(compile('b {}', opts));
```

## Options

| No opts yet!

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
