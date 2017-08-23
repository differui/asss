# SSSA Grammar

```txt
*: 0 or more
+: 1 or more
?: 0 or 1
|: separates alternatives
[ ]: grouping

stylesheet
  : S* [ rule? S* ]*
  ;
rule
  : selectors '{' S* [ declarations | rule ]* '}' S*
  ;
selectors
  : selector [ ',' S* selector ]*
  ;
selector
  : simple_selector [ combinator selector | S+ [ combinator? selector ]? ]?
  ;
simple_selector
  : element_name [ HASH | class | attrib | pseudo ]* | [ HASH | class | attrib | pseudo ]+
  ;
element_name
  : AMPERSAND | CARET | IDENT | '*'
  ;
class
  : '.' IDENT
  ;
attrib
  : '[' S* IDENT S* [ [ '=' | INCLUDES | DASHMATCH ] S* [ IDENT | STRING ] S* ]? ']'
  ;
pseudo
  : ':' [ IDENT | FUNCTION S* [IDENT S*]? ')' ]
  ;
declarations
  : declaration? [ ';' S* declaration? ]*
  ;
declaration
  : property ':' S* expr prio?
  ;
prio
  : IMPORTANT_SYM S*
  ;
operator
  : '/' S* | ',' S*
  ;
combinator
  : '+' S* | '>' S*
  ;
unary_operator
  : '-' | '+'
  ;
property
  : IDENT S*
  ;
expr
  : term [ operator? term ]*
  ;
term
  : unary_operator? [ NUMBER S* | PERCENTAGE S* | LENGTH S* | EMS S* | EXS S* | ANGLE S* | TIME S* | FREQ S* ] | STRING S* | IDENT S* | URI S* | hexcolor | function
  ;
function
  : FUNCTION S* expr ')' S*
  ;
hexcolor
  : HASH S*
  ;
```
