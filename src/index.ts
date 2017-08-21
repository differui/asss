import { setInput, getToken } from './tokenizer';

const source = `
  b {
    color: #ffffff;

    e {
      background-image: url('https://baidu.com/logo.png');
    }

    e_m {
      text-align: center;
    }
  }
`;

function parse() {
  setInput(source);
  let token = getToken();

  if (token) {
    do {
      console.log(token);
      token = getToken();
    } while (token);
  }
}

parse();
