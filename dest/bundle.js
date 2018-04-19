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

var rules = [
    {
        re: s,
        token: 'S',
    },
    {
        re: '\\/\\*[^*]*\\*+([^/*][^*]*\\*+)*\\/',
        token: 'COMMENTS',
    },
    {
        re: badcomment,
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
        re: string,
        token: 'STRING',
    },
    {
        re: badstring,
        token: 'BAD_STRING',
    },
    {
        re: ident,
        token: 'IDENT',
    },
    {
        re: "#(?:" + name + ")",
        token: 'HASH',
    },
    {
        re: "&(?:" + name + ")?",
        token: 'AMPERSAND',
    },
    {
        re: "\\^(?:" + name + ")?",
        token: 'CARET',
    },
    {
        re: "!((?:" + w + ")|(?:" + comment + "))*(?:" + I + ")(?:" + M + ")(?:" + P + ")(?:" + O + ")(?:" + R + ")(?:" + T + ")(?:" + A + ")(?:" + N + ")(?:" + T + ")",
        token: 'IMPORTANT_SYM',
    },
    {
        re: "(?:" + num + ")(?:" + E + ")(?:" + M + ")",
        token: 'EMS',
    },
    {
        re: "(?:" + num + ")(?:" + E + ")(?:" + X + ")",
        token: 'EXS',
    },
    {
        re: "(?:" + num + ")(?:" + P + ")(?:" + X + ")",
        token: 'LENGTH',
    },
    {
        re: "(?:" + num + ")(?:" + C + ")(?:" + M + ")",
        token: 'LENGTH',
    },
    {
        re: "(?:" + num + ")(?:" + M + ")(?:" + M + ")",
        token: 'LENGTH',
    },
    {
        re: "(?:" + num + ")(?:" + I + ")(?:" + N + ")",
        token: 'LENGTH',
    },
    {
        re: "(?:" + num + ")(?:" + P + ")(?:" + T + ")",
        token: 'LENGTH',
    },
    {
        re: "(?:" + num + ")(?:" + P + ")(?:" + C + ")",
        token: 'LENGTH',
    },
    {
        re: "(?:" + D + ")(?:" + E + ")(?:" + G + ")",
        token: 'ANGLE',
    },
    {
        re: "(?:" + R + ")(?:" + A + ")(?:" + D + ")",
        token: 'ANGLE',
    },
    {
        re: "(?:" + G + ")(?:" + R + ")(?:" + A + ")(?:" + D + ")",
        token: 'ANGLE',
    },
    {
        re: "(?:" + M + ")(?:" + S + ")",
        token: 'TIME',
    },
    {
        re: S,
        token: 'TIME',
    },
    {
        re: "(?:" + H + ")(?:" + Z + ")",
        token: 'FREQ',
    },
    {
        re: "(?:" + K + ")(?:" + H + ")(?:" + Z + ")",
        token: 'FREQ',
    },
    {
        re: "(?:" + num + ")(?:" + ident + ")",
        token: 'DIMENSION',
    },
    {
        re: "(?:" + num + ")%",
        token: 'PERCENTAGE',
    },
    {
        re: num,
        token: 'NUMBER',
    },
    {
        re: "url\\((?:" + w + ")(?:" + string + ")(?:" + w + ")\\)",
        token: 'URI',
    },
    {
        re: "url\\((?:" + w + ")(?:" + url + ")(?:" + w + ")\\)",
        token: 'URI',
    },
    {
        re: baduri,
        token: 'BAD_URI',
    },
    {
        re: "(?:" + ident + ")\\(",
        token: 'FUNCTION',
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
                value: yytext,
            });
        };
    })(rule);
    lexer.addRule(new RegExp(rule.re, 'i'), createToken);
});
lexer.addRule(/./, function (yytext) {
    var tokenType = 'UNKNOWN';
    switch (yytext) {
        case ':':
            tokenType = 'COLON';
            break;
        case ';':
            tokenType = 'SEMICOLON';
            break;
        case ',':
            tokenType = 'COMMA';
            break;
        case '(':
            tokenType = 'LEFT_BRACE';
            break;
        case ')':
            tokenType = 'RIGHT_BRACE';
            break;
        case '[':
            tokenType = 'LEFT_SQUARE_BRACE';
            break;
        case ']':
            tokenType = 'RIGHT_SQUARE_BRACE';
            break;
        case '{':
            tokenType = 'LEFT_CURLY_BRACE';
            break;
        case '}':
            tokenType = 'RIGHT_CURLY_BRACE';
            break;
        case '+':
            tokenType = 'PLUS';
            break;
        case '-':
            tokenType = 'MINUS';
            break;
        case '>':
            tokenType = 'GREATER_THAN';
            break;
        case '<':
            tokenType = 'LESS_THAN';
            break;
        case '=':
            tokenType = 'EQUAL';
            break;
        case '.':
            tokenType = 'DOT';
            break;
        case '*':
            tokenType = 'ASTERISK';
            break;
        case '/':
            tokenType = 'REVERSE_SOLIDUS';
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
    while (nextToken && nextToken.type === 'S') {
        nextToken = peekToken(++step);
    }
    return nextToken;
}

function makeStylesheetNode() {
    var stylesheetNode = {
        children: [],
    };
    return stylesheetNode;
}
function makeRuleNode() {
    var ruleNode = {
        selectors: [],
        declarations: [],
        children: [],
    };
    return ruleNode;
}

var token;
function parse(source) {
    setInput(source);
    token = getToken();
    if (token) {
        return {
            ast: stylesheet(),
        };
    }
    return {};
}
function stylesheet() {
    var rootNode = makeStylesheetNode();
    eatWhiteSpace();
    while (test(['IDENT', 'HASH', 'DOT', 'LEFT_SQUARE_BRACE', 'COLON'])) {
        rootNode.children.push(rule());
        eatWhiteSpace();
    }
    return rootNode;
}
function rule() {
    var ruleNode = makeRuleNode();
    ruleNode.selectors = selectors();
    match('LEFT_CURLY_BRACE');
    eatWhiteSpace();
    while (test(['AMPERSAND', 'CARET', 'IDENT', 'SEMICOLON', 'DOT', 'HASH', 'LEFT_SQUARE_BRACE', 'COLON'])) {
        var nextToken = peekNextNoWhiteSpaceToken();
        if ((test('IDENT') && nextToken && nextToken.type === 'COLON') || test('SEMICOLON')) {
            ruleNode.declarations = ruleNode.declarations.concat(declarations());
        }
        else {
            ruleNode.children.push(rule());
        }
    }
    match('RIGHT_CURLY_BRACE');
    eatWhiteSpace();
    return ruleNode;
}
function selectors() {
    var rtn = [];
    rtn.push(selector());
    while (test('COMMA')) {
        match('COMMA');
        eatWhiteSpace();
        rtn.push(selector());
    }
    return rtn;
}
function selector() {
    var rtn;
    rtn = simpleSelector();
    if (test(['PLUS', 'GREATER_THAN'])) {
        rtn += combinator();
        rtn += selector();
    }
    else if (test('S')) {
        match('S');
        if (test(['PLUS', 'GREATER_THAN', 'AMPERSAND', 'CARET', 'IDENT', 'ASTERISK', 'HASH', 'DOT', 'LEFT_SQUARE_BRACE', 'COLON'])) {
            if (test(['PLUS', 'GREATER_THAN'])) {
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
    if (test(['AMPERSAND', 'CARET', 'IDENT', 'ASTERISK'])) {
        rtn = elementName();
        while (test(['HASH', 'DOT', 'LEFT_SQUARE_BRACE', 'COLON'])) {
            switch (token.type) {
                case 'HASH':
                    rtn += token.value;
                    match('HASH');
                    break;
                case 'DOT':
                    rtn += klass();
                    break;
                case 'LEFT_SQUARE_BRACE':
                    rtn += attrib();
                    break;
                case 'COLON':
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
                case 'HASH':
                    rtn += token.value;
                    match('HASH');
                    break;
                case 'DOT':
                    rtn += klass();
                    break;
                case 'LEFT_SQUARE_BRACE':
                    rtn += attrib();
                    break;
                case 'COLON':
                    rtn += pseudo();
                    break;
                default:
            }
        } while (test(['HASH', 'DOT', 'LEFT_SQUARE_BRACE', 'COLON']));
    }
    return rtn;
}
function elementName() {
    var rtn;
    rtn = token.value;
    if (test('AMPERSAND')) {
        match('AMPERSAND');
    }
    else if (test('CARET')) {
        match('CARET');
    }
    else if (test('IDENT')) {
        match('IDENT');
    }
    else if (test('ASTERISK')) {
        match('ASTERISK');
    }
    else {
        error();
    }
    return rtn;
}
function klass() {
    var rtn;
    rtn = '.';
    match('DOT');
    rtn += token.value;
    match('IDENT');
    return rtn;
}
function attrib() {
    var rtn = '';
    rtn += '[';
    match('LEFT_SQUARE_BRACE');
    eatWhiteSpace();
    rtn += token.value;
    match('IDENT');
    eatWhiteSpace();
    if (test(['EQUAL', 'INCLUDES', 'DASHMATCH', 'S', 'IDENT', 'STRING'])) {
        if (test(['EQUAL', 'INCLUDES', 'DASHMATCH'])) {
            rtn += token.value;
            match(token.type);
        }
        eatWhiteSpace();
        if (test(['IDENT', 'STRING'])) {
            rtn += token.value;
            match(token.type);
        }
        eatWhiteSpace();
    }
    rtn += ']';
    match('RIGHT_SQUARE_BRACE');
    return rtn;
}
function pseudo() {
    var rtn;
    rtn = ':';
    match('COLON');
    var type = token.type; // depressed ts error
    switch (type) {
        case 'IDENT':
            rtn += token.value;
            match('IDENT');
            break;
        case 'FUNCTION':
            rtn += token.value;
            match('FUNCTION');
            eatWhiteSpace();
            if (token.type === 'IDENT') {
                rtn += ' ';
                rtn += token.value;
                eatWhiteSpace();
            }
            rtn += ')';
            match('RIGHT_BRACE');
            break;
        default:
            error();
    }
    return rtn;
}
function declarations() {
    var rtn = [];
    if (test('IDENT')) {
        rtn.push(declaration());
    }
    while (test('SEMICOLON')) {
        match('SEMICOLON');
        eatWhiteSpace();
        var nextToken = peekNextNoWhiteSpaceToken();
        if (test('IDENT') && nextToken && nextToken.type === 'COLON') {
            rtn.push(declaration());
        }
    }
    return rtn;
}
function declaration() {
    var rtn = ['', ''];
    rtn[0] = property();
    match('COLON');
    eatWhiteSpace();
    rtn[1] = expr();
    if (token.type === 'IMPORTANT_SYM') {
        rtn[1] += ' !important';
        match('IMPORTANT_SYM');
    }
    return rtn;
}

function operator() {
    var rtn = token.value;
    switch (token.type) {
        case 'REVERSE_SOLIDUS':
            match('REVERSE_SOLIDUS');
            break;
        case 'COMMA':
            match('COMMA');
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
        case 'PLUS':
            match('PLUS');
            break;
        case 'GREATER_THAN':
            match('GREATER_THAN');
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
        case 'PLUS':
            match('PLUS');
            break;
        case 'MINUS':
            match('MINUS');
            break;
        default:
            error();
    }
    return rtn;
}
function property() {
    var rtn = token.value;
    match('IDENT');
    eatWhiteSpace();
    return rtn;
}
function expr() {
    var rtn = term();
    while (test(['REVERSE_SOLIDUS', 'COMMA', 'PLUS', 'MINUS', 'NUMBER', 'PERCENTAGE', 'LENGTH', 'EMS', 'EXS', 'ANGLE', 'TIME', 'FREQ', 'STRING', 'IDENT', 'URI', 'HASH', 'FUNCTION'])) {
        if (test(['REVERSE_SOLIDUS', 'COMMA'])) {
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
    if (test(['PLUS', 'MINUS'])) {
        rtn += unaryOperator();
    }
    if (test(['NUMBER', 'PERCENTAGE', 'LENGTH', 'EMS', 'EXS', 'ANGLE', 'TIME', 'FREQ'])) {
        rtn += token.value;
        match(token.type);
        eatWhiteSpace();
    }
    else if (test(['STRING', 'IDENT', 'URI'])) {
        rtn += token.value;
        match(token.type);
        eatWhiteSpace();
    }
    else if (test('HASH')) {
        rtn += hexColor();
    }
    else if (test('FUNCTION')) {
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
    match('FUNCTION');
    eatWhiteSpace();
    rtn += expr();
    rtn += ')';
    match('RIGHT_BRACE');
    eatWhiteSpace();
    return rtn;
}
function hexColor() {
    var rtn = token.value;
    match('HASH');
    eatWhiteSpace();
    return rtn;
}
// utils
// ====
function eatWhiteSpace() {
    while (token && test('S')) {
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
            return "" + spaces_1 + k + ": " + v;
        }).join(';\n');
        return [
            node.selectors.join(',') + " {",
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
            tokens: tokenize(source),
        };
    }
    else if (opts.parse) {
        var ast = parse(source).ast;
        if (ast) {
            return {
                ast: ast,
            };
        }
    }
    else if (opts.transform) {
        var ast = parse(source).ast;
        if (ast) {
            return {
                ast: transform(ast),
            };
        }
    }
    else {
        var ast = parse(source).ast;
        if (ast) {
            return {
                code: generate(transform(ast), {
                    indent: 2,
                }),
            };
        }
    }
}

exports.tokenize = tokenize;
exports.parse = parse;
exports.transform = transform;
exports.generate = generate;
exports.compile = compile;
