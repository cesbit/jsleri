Javascript Left-Right Parser
============================

Related projects
----------------
- [pyleri](https://github.com/transceptor-technology/pyleri): Python parser (can export grammar to pyleri, cleri and jsleri)
- [libcleri](https://github.com/transceptor-technology/libcleri): C parser
- [goleri](https://github.com/transceptor-technology/goleri): Go parser

Why Jsleri?
-----------
Jsleri is an easy-to-use parser created for SiriDB. We first used [lrparsing](http://lrparsing.sourceforge.net/doc/html/) and wrote [jsleri](https://github.com/transceptor-technology/jsleri) for auto-completion and suggestions in our web console. Later we found small issues in lrparsing and also had difficulties keeping the language the same in both projects. That is when we decided to create both Jsleri and Pyleri where Pyleri can export it's grammar to JavaScript. Ofcourse you still can
write your grammar in Javascript too.


Quick usage
-----------
```html
<!-- Quick usage Jsleri
Note: we skip importing jsleri in future examples. -->
<script type="text/javascript" src="jsleri.js"></script>
<script type="text/javascript">

var r_name = jsleri.Regex('(?:"(?:[^"]*)")+'),
    k_hi = jsleri.Keyword('hi'),
    START = jsleri.Sequence(k_hi, r_name),
    grammar = jsleri.Grammar(START);

alert(grammar.parse('hi "Iris"').isValid);  // alerts true
alert(grammar.parse('hello "Iris"').isValid);  // alerts false

</script>
```

Real world example
------------------
In real word you would probably want to write a separate grammar file. One way to this is shown here...
```javascript
// grammar.js
(function (
            Keyword,
            Regex,
            Grammar,
            Sequence
        ) {
    var r_name = Regex('(?:"(?:[^"]*)")+');
    var k_hi = Keyword('hi');
    var START = Sequence(k_hi, r_name);

    // export grammar so we can use it in our application
    window.grammar = Grammar(START);
})(
    window.jsleri.Keyword,
    window.jsleri.Regex,
    window.jsleri.Grammar,
    window.jsleri.Sequence
);
```

```html
<!-- your html file -->
<script type="text/javascript" src="jsleri.js"></script>
<script type="text/javascript" src="grammar.js"></script>
```

Choice
------
syntax:
```javascript
Choice(element, element, ...)
```
The parser needs to choose between one of the given elements. The parser will try each element and returns the longest match.

Example: let us use `Choice` to modify the Quick usage example to allow the string 'bye "Iris"'
```javascript
var r_name  = jsleri.Regex('(?:"(?:[^"]*)")+'),
    k_hi    = jsleri.Keyword('hi'),
    k_bye   = jsleri.Keyword('bye'),
    START   = jsleri.Sequence(jsleri.Choice(k_hi, k_bye), r_name),
    grammar = jsleri.Grammar(START);

grammar.parse('hi "Iris"').isValid  // => true
grammar.parse('bye "Iris"').isValid  // => true
```

Sequence
--------
syntax:
```javascript
Sequence(element, element, ...)
```
The parser needs to match each element in a sequence.

Example:
```javascript
var START = jsleri.Sequence(
        jsleri.Keyword('Tic'),
        jsleri.Keyword('Tac'),
        jsleri.Keyword('Toe')),
    grammar = jsleri.Grammar(START);

grammar.parse('Tic Tac Toe').isValid  // => true
```

Keyword
-------
syntax:
```javascript
Keyword(keyword, ignCase)
```
The parser needs to match the keyword which is just a string. When matching keywords we need to tell the parser what characters are allowed in keywords. By default Jsleri uses `^\w+` which is both in Python and JavaScript equals to `^[A-Za-z0-9_]+`. Keyword() accepts one more argument `ignCase` to tell the parser if we should match case insensitive.

Example:

```javascript
var START   = jsleri.Keyword('tic-tac-toe', true),
    grammar = jsleri.Grammar(START, '[A-Za-z-]+');

grammar.parse('Tic-Tac-Toe').isValid  // => true
```

Repeat
------
syntax:
```javascript
Repeat(element, mi, ma)
```
The parser needs at least `mi` elements and at most `ma` elements. When `ma` is set to `undefined` we allow unlimited number of elements. `mi` can be any integer value equal of higher than 0 but not larger then `ma`. The default value for `mi` is 0 and `undefined` for `ma`

Example:
```javascript
var START   = jsleri.Repeat(jsleri.Keyword('ni')),
    grammar = jsleri.Grammar(START);

grammar.parse('ni ni ni ni ni').isValid  // => True
```

One should avoid to bind a name to the same element twice and Repeat(element, 1, 1) is a common solution to bind the element a second (or more) time(s).

For example consider the following:
```javascript
var r_name = jsleri.Regex('(?:"(?:[^"]*)")+');

// Do NOT do this
var r_address = r_name; // WRONG

// Instead use Repeat
var r_address = jsleri.Repeat(r_name, 1, 1);  // Correct
```

Ref
---
syntax:
```javascript
Ref(Constructor)
```
The grammar can make a forward reference to make recursion possible. In the example below we create a forward reference to START but note that
a reference to any element can be made.

Example:
```javascript
// make a forward reference START to a Sequence.
var START = jsleri.Ref(jsleri.Sequence);

// we can now use START
var ni_item = jsleri.Choice(jsleri.Keyword('ni'), START);

// here we actually create START
Object.assign(START, jsleri.Sequence('[', jsleri.List(ni_item), ']'));

// create and test the grammar
var grammar = jsleri.Grammar(START);
grammar.parse('[ni, ni, [ni, [], [ni, ni]]]').isValid  // => True
```

List
----
syntax:
```javascript
List(element, delimiter, mi, ma, opt)
```
List is like Repeat but with a delimiter. A comma is used as default delimiter but any element is allowed. When a string is used as delimiter it will be converted to a Token element. mi and ma work excatly like with Repeat. Opt kan be set to set to `true` to allow the list to end with a delimiter. By default this is set to `false` which means the list has to end with an element.

Example:
```javascript
var START   = jsleri.List(jsleri.Keyword('ni')),
    grammar = jsleri.Grammar(START);

grammar.parse('ni, ni, ni, ni, ni').isValid  // => True
```

Optional
--------
syntax:
```javascript
Optional(element)
```
The pasrser looks for an optional element. It is like using Repeat(element, 0, 1) but we encourage to use Optional since it is more readable. (and slightly faster)

Example:
```javascript
var r_name  = jsleri.Regex('(?:"(?:[^"]*)")+'),
    k_hi    = jsleri.Keyword('hi'),
    START   = jsleri.Sequence(k_hi, jsleri.Optional(r_name)),
    grammar = jsleri.Grammar(START);

grammar.parse('hi "Iris"').isValid  // => True
grammar.parse('hi').isValid  // => True
```

Regex
-----
syntax:
```javascript
Regex(pattern, ignCase)
```
The parser compiles a regular expression. Argument ignCase is set to `false` by default but can be set to `true` if you want the regular expression to be case insensitive. Note that `ignore case` is the only `re` flag from pyleri which will be compiled and accepted by `jsleri`.

See the Quick Usage example for how to use Regex.

Token
-----
syntax:
```javascript
Token(token)
```
A token can be one or more characters and is usually used to match operators like +, -, // and so on. When we parse a string object where jsleri expects an element, it will automatically be converted to a Token() object.

Example:
```javascript
var t_dash  = jsleri.Token('-'),
    // We could just write '-' instead of token t_dash
    // because any string will be converted to Token()
    START   = jsleri.List(jsleri.Keyword('ni'), t_dash),
    grammar = jsleri.Grammar(START);

grammar.parse('ni-ni-ni-ni-ni').isValid  // => True
```

Tokens
------
syntax:
```javascript
Tokens(tokens)
```
Can be used to register multiple tokens at once. The tokens argument should be a string with tokens seperated by spaces. If given tokens are different in size the parser will try to match the longest tokens first.

Example:
```javascript
var tks     = jsleri.Tokens('+ - !='),
    START   = jsleri.List(jsleri.Keyword('ni'), tks),
    grammar = jsleri.Grammar(START);

grammar.parse('ni + ni != ni - ni').isValid  // => True
```

Prio
----
syntax:
```javascript
Prio(element, element, ...)
```
Choose the first match from the prio elements and allow THIS for recursive operations. With THIS we point to the Prio element. Probably the example below explains how Prio and THIS can be used.

Example:
```javascript
var k_ni    = jsleri.Keyword('ni'),
    k_or    = jsleri.Keyword('or'),
    k_and   = jsleri.Keyword('and'),
    START   = jsleri.Prio(
        k_ni,
        jsleri.Sequence('(', THIS, ')'),
        jsleri.Sequence(THIS, k_or, THIS),
        jsleri.Sequence(THIS, k_and, THIS)
    ),
    grammar = jsleri.Grammar(START);

grammar.parse('(ni or ni) and (ni or ni)').isValid  // => True
```

