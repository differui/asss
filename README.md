# SSSA
> A toy CSS preprocessor implementation with SASS like grammar.

## Usage

**CLI**

```bash
npm i bcss -g

# use
bcss -c 'b {}'
bcss --compile 'b { e {} }'
bcss --help
```

**NodeJS**

```js
import compile from 'bcss';

console.log(compile('b {}', {
  // options
}));
```

## Options

| no options

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
