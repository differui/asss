'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var lexer$1 = createCommonjsModule(function (module) {
module.exports = Lexer;

Lexer.defunct = function (chr) {
    throw new Error("Unexpected character at index " + (this.index - 1) + ": " + chr);
};

function Lexer(defunct) {
    if (typeof defunct !== "function") defunct = Lexer.defunct;

    var tokens = [];
    var rules = [];
    var remove = 0;
    this.state = 0;
    this.index = 0;
    this.input = "";

    this.addRule = function (pattern, action, start) {
        var global = pattern.global;

        if (!global) {
            var flags = "g";
            if (pattern.multiline) flags += "m";
            if (pattern.ignoreCase) flags += "i";
            pattern = new RegExp(pattern.source, flags);
        }

        if (Object.prototype.toString.call(start) !== "[object Array]") start = [0];

        rules.push({
            pattern: pattern,
            global: global,
            action: action,
            start: start
        });

        return this;
    };

    this.setInput = function (input) {
        remove = 0;
        this.state = 0;
        this.index = 0;
        tokens.length = 0;
        this.input = input;
        return this;
    };

    this.lex = function () {
        if (tokens.length) return tokens.shift();

        this.reject = true;

        while (this.index <= this.input.length) {
            var matches = scan.call(this).splice(remove);
            var index = this.index;

            while (matches.length) {
                if (this.reject) {
                    var match = matches.shift();
                    var result = match.result;
                    var length = match.length;
                    this.index += length;
                    this.reject = false;
                    remove++;

                    var token = match.action.apply(this, result);
                    if (this.reject) this.index = result.index;
                    else if (typeof token !== "undefined") {
                        switch (Object.prototype.toString.call(token)) {
                        case "[object Array]":
                            tokens = token.slice(1);
                            token = token[0];
                        default:
                            if (length) remove = 0;
                            return token;
                        }
                    }
                } else break;
            }

            var input = this.input;

            if (index < input.length) {
                if (this.reject) {
                    remove = 0;
                    var token = defunct.call(this, input.charAt(this.index++));
                    if (typeof token !== "undefined") {
                        if (Object.prototype.toString.call(token) === "[object Array]") {
                            tokens = token.slice(1);
                            return token[0];
                        } else return token;
                    }
                } else {
                    if (this.index !== index) remove = 0;
                    this.reject = true;
                }
            } else if (matches.length)
                this.reject = true;
            else break;
        }
    };

    function scan() {
        var matches = [];
        var index = 0;

        var state = this.state;
        var lastIndex = this.index;
        var input = this.input;

        for (var i = 0, length = rules.length; i < length; i++) {
            var rule = rules[i];
            var start = rule.start;
            var states = start.length;

            if ((!states || start.indexOf(state) >= 0) ||
                (state % 2 && states === 1 && !start[0])) {
                var pattern = rule.pattern;
                pattern.lastIndex = lastIndex;
                var result = pattern.exec(input);

                if (result && result.index === lastIndex) {
                    var j = matches.push({
                        result: result,
                        action: rule.action,
                        length: result[0].length
                    });

                    if (rule.global) index = j;

                    while (--j > index) {
                        var k = j - 1;

                        if (matches[j].length > matches[k].length) {
                            var temple = matches[j];
                            matches[j] = matches[k];
                            matches[k] = temple;
                        }
                    }
                }
            }
        }

        return matches;
    }
}
});

var h = '[0-9a-f]';
var nonascii = '[\\xA0-\\xFF]';
var unicode = "\\\\(?:" + h + "){1,6}(\\r\\n|[ \\t\\r\\n\\f])?";
var escape = "(?:" + unicode + ")|\\\\[^\\r\\n\\f0-9a-f]";
var nmstart = "[_a-z]|(?:" + nonascii + ")|(?:" + escape + ")";
var nmchar = "[_a-z0-9-]|(?:" + nonascii + ")|(?:" + escape + ")";
var nl = '\\n|\\r\\n|\\r|\\f';
var string1 = "\\\"([^\\n\\r\\f\\\\\"]|\\\\(?:" + nl + ")|(?:" + escape + "))*\\\"";
var string2 = "\\'([^\\n\\r\\f\\\\']|\\\\(?:" + nl + ")|(?:" + escape + "))*\\'";
var badstring1 = "\\\"([^\\n\\r\\f\\\\\"]|\\\\(?:" + nl + ")|(?:" + escape + "))*\\\\?";
var badstring2 = "\\'([^\\n\\r\\f\\\\']|\\\\(?:" + nl + ")|(?:" + escape + "))*\\\\?";
var badcomment1 = '\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*';
var badcomment2 = '\\/\\*[^*]*(\\*+[^/*][^*]*)*';
var s = '[ \\t\\r\\n\\f]+';
var w = "(?:" + s + ")?";
var string = "(?:" + string1 + ")|(?:" + string2 + ")";
var badstring = "(?:" + badstring1 + ")|(?:" + badstring2 + ")";
var baduri1 = "url\\((?:" + w + ")([!#$%&*-\\[\\]-~]|(?:" + nonascii + ")|(?:" + escape + "))*(?:" + w + ")";
var baduri2 = "url\\((?:" + w + ")(?:" + string + ")(?:" + w + ")";
var baduri3 = "url\\((?:" + w + ")(?:" + badstring + ")";
var comment = '\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\/';
var ident = "-?(?:" + nmstart + ")(?:" + nmchar + ")*";
var name = "(?:" + nmchar + ")+";
var num = '[0-9]+|[0-9]*\\.[0-9]+';
var badcomment = "(?:" + badcomment1 + ")|(?:" + badcomment2 + ")";
var baduri = "(?:" + baduri1 + ")|(?:" + baduri2 + ")|(?:" + baduri3 + ")";
var url = "([!#$%&*-~]|(?:" + nonascii + ")|(?:" + escape + "))*";
var A = 'a|\\\\0{0,4}(41|61)(\\r\\n|[ \\t\\r\\n\\f])?';
var C = 'c|\\\\0{0,4}(43|63)(\\r\\n|[ \\t\\r\\n\\f])?';
var D = 'd|\\\\0{0,4}(44|64)(\\r\\n|[ \\t\\r\\n\\f])?';
var E = 'e|\\\\0{0,4}(45|65)(\\r\\n|[ \\t\\r\\n\\f])?';
var G = 'g|\\\\0{0,4}(47|67)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\g';
var H = 'h|\\\\0{0,4}(48|68)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\h';
var I = 'i|\\\\0{0,4}(49|69)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\i';
var K = 'k|\\\\0{0,4}(4b|6b)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\k';

var M = 'm|\\\\0{0,4}(4d|6d)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\m';
var N = 'n|\\\\0{0,4}(4e|6e)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\n';
var O = 'o|\\\\0{0,4}(4f|6f)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\o';
var P = 'p|\\\\0{0,4}(50|70)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\p';
var R = 'r|\\\\0{0,4}(52|72)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\r';
var S = 's|\\\\0{0,4}(53|73)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\s';
var T = 't|\\\\0{0,4}(54|74)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\t';

var X = 'x|\\\\0{0,4}(58|78)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\x';
var Z = 'z|\\\\0{0,4}(5a|7a)(\\r\\n|[ \\t\\r\\n\\f])?|\\\\z';

var TOKEN_TYPE;
(function (TOKEN_TYPE) {
    TOKEN_TYPE[TOKEN_TYPE["S"] = 'S'] = "S";
    TOKEN_TYPE[TOKEN_TYPE["COMMENTS"] = 'COMMENTS'] = "COMMENTS";
    TOKEN_TYPE[TOKEN_TYPE["BAD_COMMENTS"] = 'BAD_COMMENTS'] = "BAD_COMMENTS";
    TOKEN_TYPE[TOKEN_TYPE["INCLUDES"] = 'INCLUDES'] = "INCLUDES";
    TOKEN_TYPE[TOKEN_TYPE["DASHMATCH"] = 'DASHMATCH'] = "DASHMATCH";
    TOKEN_TYPE[TOKEN_TYPE["STRING"] = 'STRING'] = "STRING";
    TOKEN_TYPE[TOKEN_TYPE["BAD_STRING"] = 'BAD_STRING'] = "BAD_STRING";
    TOKEN_TYPE[TOKEN_TYPE["IDENT"] = 'IDENT'] = "IDENT";
    TOKEN_TYPE[TOKEN_TYPE["HASH"] = 'HASH'] = "HASH";
    TOKEN_TYPE[TOKEN_TYPE["IMPORTANT_SYM"] = 'IMPORTANT_SYM'] = "IMPORTANT_SYM";
    TOKEN_TYPE[TOKEN_TYPE["EMS"] = 'EMS'] = "EMS";
    TOKEN_TYPE[TOKEN_TYPE["EXS"] = 'EXS'] = "EXS";
    TOKEN_TYPE[TOKEN_TYPE["LENGTH"] = 'LENGTH'] = "LENGTH";
    TOKEN_TYPE[TOKEN_TYPE["ANGLE"] = 'ANGLE'] = "ANGLE";
    TOKEN_TYPE[TOKEN_TYPE["TIME"] = 'TIME'] = "TIME";
    TOKEN_TYPE[TOKEN_TYPE["FREQ"] = 'FREQ'] = "FREQ";
    TOKEN_TYPE[TOKEN_TYPE["DIMENSION"] = 'DIMENSION'] = "DIMENSION";
    TOKEN_TYPE[TOKEN_TYPE["PERCENTAGE"] = 'PERCENTAGE'] = "PERCENTAGE";
    TOKEN_TYPE[TOKEN_TYPE["NUMBER"] = 'NUMBER'] = "NUMBER";
    TOKEN_TYPE[TOKEN_TYPE["URI"] = 'URI'] = "URI";
    TOKEN_TYPE[TOKEN_TYPE["BAD_URI"] = 'BAD_URI'] = "BAD_URI";
    TOKEN_TYPE[TOKEN_TYPE["FUNCTION"] = 'FUNCTION'] = "FUNCTION";
    // marks
    TOKEN_TYPE[TOKEN_TYPE["COLON"] = 'COLON'] = "COLON";
    TOKEN_TYPE[TOKEN_TYPE["SEMICOLON"] = 'SEMICOLON'] = "SEMICOLON";
    TOKEN_TYPE[TOKEN_TYPE["COMMA"] = 'COMMA'] = "COMMA";
    TOKEN_TYPE[TOKEN_TYPE["LEFT_BRACE"] = 'LEFT_BRACE'] = "LEFT_BRACE";
    TOKEN_TYPE[TOKEN_TYPE["RIGHT_BRACE"] = 'RIGHT_BRACE'] = "RIGHT_BRACE";
    TOKEN_TYPE[TOKEN_TYPE["LEFT_CURLY_BRACE"] = 'LEFT_CURLY_BRACE'] = "LEFT_CURLY_BRACE";
    TOKEN_TYPE[TOKEN_TYPE["RIGHT_CURLY_BRACE"] = 'RIGHT_CURLY_BRACE'] = "RIGHT_CURLY_BRACE";
    TOKEN_TYPE[TOKEN_TYPE["LEFT_SQUARE_BRACE"] = 'LEFT_SQUARE_BRACE'] = "LEFT_SQUARE_BRACE";
    TOKEN_TYPE[TOKEN_TYPE["RIGHT_SQUARE_BRACE"] = 'RIGHT_SQUARE_BRACE'] = "RIGHT_SQUARE_BRACE";
    TOKEN_TYPE[TOKEN_TYPE["PLUS"] = 'PLUS'] = "PLUS";
    TOKEN_TYPE[TOKEN_TYPE["MINUS"] = 'MINUS'] = "MINUS";
    TOKEN_TYPE[TOKEN_TYPE["GREATER_THAN"] = 'GREATER_THAN'] = "GREATER_THAN";
    TOKEN_TYPE[TOKEN_TYPE["LESS_THAN"] = 'LESS_THAN'] = "LESS_THAN";
    TOKEN_TYPE[TOKEN_TYPE["EQUAL"] = 'EQUAL'] = "EQUAL";
    TOKEN_TYPE[TOKEN_TYPE["DOT"] = 'DOT'] = "DOT";
    TOKEN_TYPE[TOKEN_TYPE["ASTERISK"] = 'ASTERISK'] = "ASTERISK";
    TOKEN_TYPE[TOKEN_TYPE["REVERSE_SOLIDUS"] = 'REVERSE_SOLIDUS'] = "REVERSE_SOLIDUS";
    TOKEN_TYPE[TOKEN_TYPE["AMPERSAND"] = 'AMPERSAND'] = "AMPERSAND";
    TOKEN_TYPE[TOKEN_TYPE["CARET"] = 'CARET'] = "CARET";
    TOKEN_TYPE[TOKEN_TYPE["UNKNOWN"] = 'UNKNOWN'] = "UNKNOWN";
})(TOKEN_TYPE || (TOKEN_TYPE = {}));

var rules = [
    {
        re: s,
        token: TOKEN_TYPE.S
    },
    {
        re: '\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\/',
        token: TOKEN_TYPE.COMMENTS
    },
    {
        re: badcomment,
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
        re: string,
        token: TOKEN_TYPE.STRING
    },
    {
        re: badstring,
        token: TOKEN_TYPE.BAD_STRING
    },
    {
        re: ident,
        token: TOKEN_TYPE.IDENT
    },
    {
        re: "#(?:" + name + ")",
        token: TOKEN_TYPE.HASH
    },
    {
        re: "&(?:" + name + ")?",
        token: TOKEN_TYPE.AMPERSAND
    },
    {
        re: "\\^(?:" + name + ")?",
        token: TOKEN_TYPE.CARET
    },
    {
        re: "!((?:" + w + ")|(?:" + comment + "))*(?:" + I + ")(?:" + M + ")(?:" + P + ")(?:" + O + ")(?:" + R + ")(?:" + T + ")(?:" + A + ")(?:" + N + ")(?:" + T + ")",
        token: TOKEN_TYPE.IMPORTANT_SYM
    },
    {
        re: "(?:" + num + ")(?:" + E + ")(?:" + M + ")",
        token: TOKEN_TYPE.EMS
    },
    {
        re: "(?:" + num + ")(?:" + E + ")(?:" + X + ")",
        token: TOKEN_TYPE.EXS
    },
    {
        re: "(?:" + num + ")(?:" + P + ")(?:" + X + ")",
        token: TOKEN_TYPE.LENGTH
    },
    {
        re: "(?:" + num + ")(?:" + C + ")(?:" + M + ")",
        token: TOKEN_TYPE.LENGTH
    },
    {
        re: "(?:" + num + ")(?:" + M + ")(?:" + M + ")",
        token: TOKEN_TYPE.LENGTH
    },
    {
        re: "(?:" + num + ")(?:" + I + ")(?:" + N + ")",
        token: TOKEN_TYPE.LENGTH
    },
    {
        re: "(?:" + num + ")(?:" + P + ")(?:" + T + ")",
        token: TOKEN_TYPE.LENGTH
    },
    {
        re: "(?:" + num + ")(?:" + P + ")(?:" + C + ")",
        token: TOKEN_TYPE.LENGTH
    },
    {
        re: "(?:" + D + ")(?:" + E + ")(?:" + G + ")",
        token: TOKEN_TYPE.ANGLE
    },
    {
        re: "(?:" + R + ")(?:" + A + ")(?:" + D + ")",
        token: TOKEN_TYPE.ANGLE
    },
    {
        re: "(?:" + G + ")(?:" + R + ")(?:" + A + ")(?:" + D + ")",
        token: TOKEN_TYPE.ANGLE
    },
    {
        re: "(?:" + M + ")(?:" + S + ")",
        token: TOKEN_TYPE.TIME
    },
    {
        re: S,
        token: TOKEN_TYPE.TIME
    },
    {
        re: "(?:" + H + ")(?:" + Z + ")",
        token: TOKEN_TYPE.FREQ
    },
    {
        re: "(?:" + K + ")(?:" + H + ")(?:" + Z + ")",
        token: TOKEN_TYPE.FREQ
    },
    {
        re: "(?:" + num + ")(?:" + ident + ")",
        token: TOKEN_TYPE.DIMENSION
    },
    {
        re: "(?:" + num + ")%",
        token: TOKEN_TYPE.PERCENTAGE
    },
    {
        re: num,
        token: TOKEN_TYPE.NUMBER
    },
    {
        re: "url\\((?:" + w + ")(?:" + string + ")(?:" + w + ")\\)",
        token: TOKEN_TYPE.URI
    },
    {
        re: "url\\((?:" + w + ")(?:" + url + ")(?:" + w + ")\\)",
        token: TOKEN_TYPE.URI
    },
    {
        re: baduri,
        token: TOKEN_TYPE.BAD_URI
    },
    {
        re: "(?:" + ident + ")\\(",
        token: TOKEN_TYPE.FUNCTION
    }
];

var index = 0;
var row = 1;
var col = 1;
var tokens = [];
var lexer = new lexer$1(function (char) {
    throw new Error("Unexpected character at row " + row + ", col " + col + ": " + char);
});
rules.forEach(function (rule) {
    var createToken = (function (r) {
        return function (yytext) {
            tokens.push({
                type: r.token,
                value: yytext
            });
        };
    })(rule);
    lexer.addRule(new RegExp(rule.re, 'i'), createToken);
});
lexer.addRule(/./, function (yytext) {
    var tokenType = TOKEN_TYPE.UNKNOWN;
    switch (yytext) {
        case ':':
            tokenType = TOKEN_TYPE.COLON;
            break;
        case ';':
            tokenType = TOKEN_TYPE.SEMICOLON;
            break;
        case ',':
            tokenType = TOKEN_TYPE.COMMA;
            break;
        case '(':
            tokenType = TOKEN_TYPE.LEFT_BRACE;
            break;
        case ')':
            tokenType = TOKEN_TYPE.RIGHT_BRACE;
            break;
        case '[':
            tokenType = TOKEN_TYPE.LEFT_SQUARE_BRACE;
            break;
        case ']':
            tokenType = TOKEN_TYPE.RIGHT_SQUARE_BRACE;
            break;
        case '{':
            tokenType = TOKEN_TYPE.LEFT_CURLY_BRACE;
            break;
        case '}':
            tokenType = TOKEN_TYPE.RIGHT_CURLY_BRACE;
            break;
        case '+':
            tokenType = TOKEN_TYPE.PLUS;
            break;
        case '-':
            tokenType = TOKEN_TYPE.MINUS;
            break;
        case '>':
            tokenType = TOKEN_TYPE.GREATER_THAN;
            break;
        case '<':
            tokenType = TOKEN_TYPE.LESS_THAN;
            break;
        case '=':
            tokenType = TOKEN_TYPE.EQUAL;
            break;
        case '.':
            tokenType = TOKEN_TYPE.DOT;
            break;
        case '*':
            tokenType = TOKEN_TYPE.ASTERISK;
            break;
        case '/':
            tokenType = TOKEN_TYPE.REVERSE_SOLIDUS;
            break;
        default: ;
    }
    tokens.push({
        type: tokenType,
        value: yytext
    });
});
function setInput(source) {
    index = 0;
    lexer.input = source;
    lexer.lex();
}
function getToken() {
    if (index < tokens.length) {
        return tokens[index++];
    }
}
function peekToken(step) {
    if (step === void 0) { step = 0; }
    var targetIndex = index + step - 1;
    if ((targetIndex < tokens.length) && (targetIndex >= 0)) {
        return tokens[targetIndex];
    }
}
function peekNextNoWhiteSpaceToken() {
    var step = 1;
    var nextToken = peekToken(step);
    while (nextToken && nextToken.type === TOKEN_TYPE.S) {
        nextToken = peekToken(++step);
    }
    return nextToken;
}

function makeStylesheetNode() {
    var stylesheetNode = {
        children: []
    };
    return stylesheetNode;
}
function makeRuleNode() {
    var ruleNode = {
        selectors: [],
        declarations: [],
        children: []
    };
    return ruleNode;
}

var token;
function parse(source) {
    setInput(source);
    token = getToken();
    if (token) {
        return {
            ast: stylesheet()
        };
    }
    return {};
}
function stylesheet() {
    var rootNode = makeStylesheetNode();
    eatWhiteSpace();
    while (test([TOKEN_TYPE.IDENT, TOKEN_TYPE.HASH, TOKEN_TYPE.DOT, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON])) {
        rootNode.children.push(rule());
        eatWhiteSpace();
    }
    return rootNode;
}
function rule() {
    var ruleNode = makeRuleNode();
    ruleNode.selectors = selectors();
    match(TOKEN_TYPE.LEFT_CURLY_BRACE);
    eatWhiteSpace();
    while (test([TOKEN_TYPE.AMPERSAND, TOKEN_TYPE.CARET, TOKEN_TYPE.IDENT, TOKEN_TYPE.SEMICOLON, TOKEN_TYPE.DOT, TOKEN_TYPE.HASH, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON])) {
        var nextToken = peekNextNoWhiteSpaceToken();
        if ((test(TOKEN_TYPE.IDENT) && nextToken && nextToken.type === TOKEN_TYPE.COLON) || test(TOKEN_TYPE.SEMICOLON)) {
            ruleNode.declarations = ruleNode.declarations.concat(declarations());
        }
        else {
            ruleNode.children.push(rule());
        }
    }
    match(TOKEN_TYPE.RIGHT_CURLY_BRACE);
    eatWhiteSpace();
    return ruleNode;
}
function selectors() {
    var rtn = [];
    rtn.push(selector());
    while (test(TOKEN_TYPE.COMMA)) {
        match(TOKEN_TYPE.COMMA);
        eatWhiteSpace();
        rtn.push(selector());
    }
    return rtn;
}
function selector() {
    var rtn;
    rtn = simpleSelector();
    if (test([TOKEN_TYPE.PLUS, TOKEN_TYPE.GREATER_THAN])) {
        rtn += combinator();
        rtn += selector();
    }
    else if (test(TOKEN_TYPE.S)) {
        match(TOKEN_TYPE.S);
        if (test([TOKEN_TYPE.PLUS, TOKEN_TYPE.GREATER_THAN, TOKEN_TYPE.AMPERSAND, TOKEN_TYPE.CARET, TOKEN_TYPE.IDENT, TOKEN_TYPE.ASTERISK, TOKEN_TYPE.HASH, TOKEN_TYPE.DOT, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON])) {
            if (test([TOKEN_TYPE.PLUS, TOKEN_TYPE.GREATER_THAN])) {
                rtn += ' ';
                rtn += combinator();
            }
            rtn += ' ';
            rtn += selector();
        }
    }
    return rtn;
}
function simpleSelector() {
    var rtn;
    if (test([TOKEN_TYPE.AMPERSAND, TOKEN_TYPE.CARET, TOKEN_TYPE.IDENT, TOKEN_TYPE.ASTERISK])) {
        rtn = elementName();
        while (test([TOKEN_TYPE.HASH, TOKEN_TYPE.DOT, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON])) {
            switch (token.type) {
                case TOKEN_TYPE.HASH:
                    rtn += token.value;
                    match(TOKEN_TYPE.HASH);
                    break;
                case TOKEN_TYPE.DOT:
                    rtn += klass();
                    break;
                case TOKEN_TYPE.LEFT_SQUARE_BRACE:
                    rtn += attrib();
                    break;
                case TOKEN_TYPE.COLON:
                    rtn += pseudo();
                    break;
                default:
            }
        }
    }
    else {
        rtn = '';
        do {
            switch (token.type) {
                case TOKEN_TYPE.HASH:
                    rtn += token.value;
                    match(TOKEN_TYPE.HASH);
                    break;
                case TOKEN_TYPE.DOT:
                    rtn += klass();
                    break;
                case TOKEN_TYPE.LEFT_SQUARE_BRACE:
                    rtn += attrib();
                    break;
                case TOKEN_TYPE.COLON:
                    rtn += pseudo();
                    break;
                default:
            }
        } while (test([TOKEN_TYPE.HASH, TOKEN_TYPE.DOT, TOKEN_TYPE.LEFT_SQUARE_BRACE, TOKEN_TYPE.COLON]));
    }
    return rtn;
}
function elementName() {
    var rtn;
    rtn = token.value;
    if (test(TOKEN_TYPE.AMPERSAND)) {
        match(TOKEN_TYPE.AMPERSAND);
    }
    else if (test(TOKEN_TYPE.CARET)) {
        match(TOKEN_TYPE.CARET);
    }
    else if (test(TOKEN_TYPE.IDENT)) {
        match(TOKEN_TYPE.IDENT);
    }
    else if (test(TOKEN_TYPE.ASTERISK)) {
        match(TOKEN_TYPE.ASTERISK);
    }
    else {
        error();
    }
    return rtn;
}
function klass() {
    var rtn;
    rtn = '.';
    match(TOKEN_TYPE.DOT);
    rtn += token.value;
    match(TOKEN_TYPE.IDENT);
    return rtn;
}
function attrib() {
    var rtn = '';
    rtn += '[';
    match(TOKEN_TYPE.LEFT_SQUARE_BRACE);
    eatWhiteSpace();
    rtn += token.value;
    match(TOKEN_TYPE.IDENT);
    eatWhiteSpace();
    if (test([TOKEN_TYPE.EQUAL, TOKEN_TYPE.INCLUDES, TOKEN_TYPE.DASHMATCH, TOKEN_TYPE.S, TOKEN_TYPE.IDENT, TOKEN_TYPE.STRING])) {
        if (test([TOKEN_TYPE.EQUAL, TOKEN_TYPE.INCLUDES, TOKEN_TYPE.DASHMATCH])) {
            rtn += token.value;
            match(token.type);
        }
        eatWhiteSpace();
        if (test([TOKEN_TYPE.IDENT, TOKEN_TYPE.STRING])) {
            rtn += token.value;
            match(token.type);
        }
        eatWhiteSpace();
    }
    rtn += ']';
    match(TOKEN_TYPE.RIGHT_SQUARE_BRACE);
    return rtn;
}
function pseudo() {
    var rtn;
    rtn = ':';
    match(TOKEN_TYPE.COLON);
    var type = token.type; // depressed ts error
    switch (type) {
        case TOKEN_TYPE.IDENT:
            rtn += token.value;
            match(TOKEN_TYPE.IDENT);
            break;
        case TOKEN_TYPE.FUNCTION:
            rtn += token.value;
            match(TOKEN_TYPE.FUNCTION);
            eatWhiteSpace();
            if (token.type === TOKEN_TYPE.IDENT) {
                rtn += ' ';
                rtn += token.value;
                eatWhiteSpace();
            }
            rtn += ')';
            match(TOKEN_TYPE.RIGHT_BRACE);
            break;
        default:
            error();
    }
    return rtn;
}
function declarations() {
    var rtn = [];
    if (test(TOKEN_TYPE.IDENT)) {
        rtn.push(declaration());
    }
    while (test(TOKEN_TYPE.SEMICOLON)) {
        match(TOKEN_TYPE.SEMICOLON);
        eatWhiteSpace();
        var nextToken = peekNextNoWhiteSpaceToken();
        if (test(TOKEN_TYPE.IDENT) && nextToken && nextToken.type === TOKEN_TYPE.COLON) {
            rtn.push(declaration());
        }
    }
    return rtn;
}
function declaration() {
    var rtn = ['', ''];
    rtn[0] = property();
    match(TOKEN_TYPE.COLON);
    eatWhiteSpace();
    rtn[1] = expr();
    if (token.type === TOKEN_TYPE.IMPORTANT_SYM) {
        rtn[1] += ' !important';
        match(TOKEN_TYPE.IMPORTANT_SYM);
    }
    return rtn;
}

function operator() {
    var rtn = token.value;
    switch (token.type) {
        case TOKEN_TYPE.REVERSE_SOLIDUS:
            match(TOKEN_TYPE.REVERSE_SOLIDUS);
            break;
        case TOKEN_TYPE.COMMA:
            match(TOKEN_TYPE.COMMA);
            break;
        default:
            error();
    }
    eatWhiteSpace();
    return rtn;
}
function combinator() {
    var rtn = token.value;
    switch (token.type) {
        case TOKEN_TYPE.PLUS:
            match(TOKEN_TYPE.PLUS);
            break;
        case TOKEN_TYPE.GREATER_THAN:
            match(TOKEN_TYPE.GREATER_THAN);
            break;
        default:
            error();
    }
    eatWhiteSpace();
    return rtn;
}
function unaryOperator() {
    var rtn = token.value;
    switch (token.type) {
        case TOKEN_TYPE.PLUS:
            match(TOKEN_TYPE.PLUS);
            break;
        case TOKEN_TYPE.MINUS:
            match(TOKEN_TYPE.MINUS);
            break;
        default:
            error();
    }
    return rtn;
}
function property() {
    var rtn = token.value;
    match(TOKEN_TYPE.IDENT);
    eatWhiteSpace();
    return rtn;
}
function expr() {
    var rtn = term();
    while (test([TOKEN_TYPE.REVERSE_SOLIDUS, TOKEN_TYPE.COMMA, TOKEN_TYPE.PLUS, TOKEN_TYPE.MINUS, TOKEN_TYPE.NUMBER, TOKEN_TYPE.PERCENTAGE, TOKEN_TYPE.LENGTH, TOKEN_TYPE.EMS, TOKEN_TYPE.EXS, TOKEN_TYPE.ANGLE, TOKEN_TYPE.TIME, TOKEN_TYPE.FREQ, TOKEN_TYPE.STRING, TOKEN_TYPE.IDENT, TOKEN_TYPE.URI, TOKEN_TYPE.HASH, TOKEN_TYPE.FUNCTION])) {
        if (test([TOKEN_TYPE.REVERSE_SOLIDUS, TOKEN_TYPE.COMMA])) {
            rtn += operator();
        }
        else {
            rtn += rtn ? ' ' : rtn;
        }
        rtn += term();
    }
    return rtn;
}
function term() {
    var rtn = '';
    if (test([TOKEN_TYPE.PLUS, TOKEN_TYPE.MINUS])) {
        rtn += unaryOperator();
    }
    if (test([TOKEN_TYPE.NUMBER, TOKEN_TYPE.PERCENTAGE, TOKEN_TYPE.LENGTH, TOKEN_TYPE.EMS, TOKEN_TYPE.EXS, TOKEN_TYPE.ANGLE, TOKEN_TYPE.TIME, TOKEN_TYPE.FREQ])) {
        rtn += token.value;
        match(token.type);
        eatWhiteSpace();
    }
    else if (test([TOKEN_TYPE.STRING, TOKEN_TYPE.IDENT, TOKEN_TYPE.URI])) {
        rtn += token.value;
        match(token.type);
        eatWhiteSpace();
    }
    else if (test(TOKEN_TYPE.HASH)) {
        rtn += hexColor();
    }
    else if (test(TOKEN_TYPE.FUNCTION)) {
        rtn += func();
    }
    else {
        error();
    }
    return rtn;
}
function func() {
    var rtn;
    rtn = token.value;
    match(TOKEN_TYPE.FUNCTION);
    eatWhiteSpace();
    rtn += expr();
    rtn += ')';
    match(TOKEN_TYPE.RIGHT_BRACE);
    eatWhiteSpace();
    return rtn;
}
function hexColor() {
    var rtn = token.value;
    match(TOKEN_TYPE.HASH);
    eatWhiteSpace();
    return rtn;
}
// utils
// ====
function eatWhiteSpace() {
    while (token && test(TOKEN_TYPE.S)) {
        next();
    }
}
function test(expected) {
    if (!token) {
        return false;
    }
    if (Array.isArray(expected)) {
        return expected.indexOf(token.type) > -1;
    }
    else {
        return token.type === expected;
    }
}
function next() {
    token = getToken();
}
function match(expected) {
    if (test(expected)) {
        next();
    }
    else {
        error();
    }
}
function error() {
    throw new Error('parse error');
}

var stack = [];
var MAX_STACK_LENGTH = 999;
function sPush(item) {
    if (stack.length < MAX_STACK_LENGTH) {
        stack.push(item);
    }
    else {
        throw new Error('Stack overflow');
    }
}
function sPop() {
    if (!sIsEmpty()) {
        return stack.pop();
    }
    throw new Error('Stack is empty');
}
function sTop() {
    if (!sIsEmpty()) {
        return stack[stack.length - 1];
    }
    throw new Error('Stack is empty');
}
function sBottom() {
    if (!sIsEmpty()) {
        return stack[0];
    }
    throw new Error('Stack is empty');
}
function sIsEmpty() {
    return stack.length === 0;
}

function transform(ast) {
    return transformStyleSheet(ast);
}
function transformStyleSheet(node) {
    var stylesheetNode = makeStylesheetNode();
    if (node.children.length) {
        node.children.forEach(function (node) { return transformRule(node).forEach(function (subNode) { return stylesheetNode.children.push(subNode); }); });
    }
    return stylesheetNode;
}
function transformRule(node) {
    var rtn = [];
    var ruleNode = makeRuleNode();
    ruleNode.declarations = node.declarations;
    node.selectors.forEach(function (s) {
        expandSelector(s).forEach(function (s) { return ruleNode.selectors.push(s); });
    });
    sPush(ruleNode);
    rtn.push(ruleNode);
    node.children.forEach(function (node) { return transformRule(node).forEach(function (subNode) { return rtn.push(subNode); }); });
    sPop();
    return rtn;
}
// utils
// ====
function expandSelector(selector) {
    if (sIsEmpty()) {
        return [selector];
    }
    else if (selector.indexOf('&') > -1) {
        return sTop().selectors.map(function (parentSelector) {
            return selector.replace(/&/g, parentSelector);
        });
    }
    else if (selector.indexOf('^') > -1) {
        var rtn_1 = [];
        sBottom().selectors.map(function (rootSelector) {
            sTop().selectors.map(function (parentSelector) {
                rtn_1.push(parentSelector + " " + selector.replace(/\^/g, rootSelector));
            });
        });
        return rtn_1;
    }
    else {
        return sTop().selectors.map(function (parentSelector) {
            return parentSelector + " " + selector;
        });
    }
}

function generate(ast, opts) {
    var rtn = [];
    ast.children.forEach(function (node) {
        var rule = generateRule(node, opts.indent);
        if (rule) {
            rtn.push(rule);
        }
    });
    return rtn.join('\n');
}
function generateRule(node, indent) {
    if (node.declarations.length) {
        var spaces_1 = new Array(indent + 1).join(' ');
        var declarations = node.declarations.map(function (_a) {
            var k = _a[0], v = _a[1];
            return ("" + spaces_1 + k + ": " + v);
        }).join(';\n');
        return [
            (node.selectors.join(',') + " {"),
            declarations,
            '}'
        ].join('\n');
    }
    return '';
}

function tokenize(source) {
    var tokens = [];
    var token;
    setInput(source);
    token = getToken();
    while (token) {
        tokens.push(token);
        token = getToken();
    }
    return tokens;
}
function compile(source, opts) {
    if (opts.scan) {
        return {
            tokens: tokenize(source)
        };
    }
    else if (opts.parse) {
        var ast = parse(source).ast;
        if (ast) {
            return {
                ast
            };
        }
    }
    else if (opts.transform) {
        var ast = parse(source).ast;
        if (ast) {
            return {
                ast: transform(ast)
            };
        }
    }
    else {
        var ast = parse(source).ast;
        if (ast) {
            return {
                code: generate(transform(ast), {
                    indent: 2
                })
            };
        }
    }
}

exports.tokenize = tokenize;
exports.parse = parse;
exports.transform = transform;
exports.generate = generate;
exports.compile = compile;
