# Javascript Left-Right Parser
Jsleri is an easy-to-use language parser for JavaScript.

---------------------------------------
  * [Installation](#installation)
  * [Related projects](#related-projects)
  * [Quick usage](#quick-usage)
  * [Grammar](#grammar)
    * [Grammar.parse()](#parse)
  * [Result](#result)
    * [isValid](#isvalid)
    * [Position](#position)
    * [Tree](#tree)
    * [Expecting](#expecting)
  * [Elements](#elements)
    * [Keyword](#keyword)
    * [Regex](#regex)
    * [Token](#token)
    * [Tokens](#tokens)
    * [Sequence](#sequence)
    * [Choice](#choice)
    * [Repeat](#repeat)
    * [List](#list)
    * [Optional](#optional)
    * [Ref](#ref)
    * [Prio](#prio)

---------------------------------------

## Installation
Using npm:

```
$ npm i jsleri
```

In your project:

```javascript
import * as jsleri from 'jsleri';
// Exposes:
// - jsleri.version
// - jsleri.noop
// - jsleri.Keyword
// - jsleri.Regex
// - jsleri.Token
// - jsleri.Tokens
// - jsleri.Sequence
// - jsleri.Choice
// - jsleri.Repeat
// - jsleri.List
// - jsleri.Optional
// - jsleri.Ref
// - jsleri.Prio
// - jsleri.THIS
// - jsleri.Grammar
// - jsleri.EOS

```

Or... download the latest release from [here](https://github.com/transceptor-technology/jsleri/releases/latest) and load the file in inside your project.
For example:
```html
<!-- Add this line to the <head> section to expose window.jsleri -->
<script src="jsleri-1.1.12.min.js"></script>
```

## Related projects
- [pyleri](https://github.com/transceptor-technology/pyleri): Python parser (can export grammar to pyleri, cleri and jsleri)
- [libcleri](https://github.com/transceptor-technology/libcleri): C parser
- [goleri](https://github.com/transceptor-technology/goleri): Go parser
- [jleri](https://github.com/transceptor-technology/jleri): Java parser


## Quick usage
```javascript
import { Regex, Keyword, Sequence, Grammar } from 'jsleri';

// create your grammar
class MyGrammar extends Grammar {
    static START = Sequence(
        Keyword('hi'),
        Regex('(?:"(?:[^"]*)")+')
    );
}

// create a instance of your grammar
const myGrammar = new MyGrammar();

// do something with the grammar
alert(myGrammar.parse('hi "Iris"').isValid);  // alerts true
alert(myGrammar.parse('hello "Iris"').isValid);  // alerts false
```

## Grammar
When writing a grammar you should subclass Grammar. A Grammar expects at least a `START` property so the parser knows where to start parsing. Grammar has a parse method: `parse()`.


### parse
syntax:
```javascript
myGrammar.parse(string)
```
The `parse()` method returns a result object which has the following properties that are further explained in [Result](#result):
- `expecting`
- `isValid`
- `pos`
- `tree`


## Result
The result of the `parse()` method contains 4 properties that will be explained next.

### isValid
`isValid` returns a boolean value, `True` when the given string is valid according to the given grammar, `False` when not valid.
node_result.isValid) # => False

Let us take the example from Quick usage.
```javascript
alert(myGrammar.parse('hello "Iris"').isValid);  // alerts false
```

### Position
`pos` returns the position where the parser had to stop. (when `isValid` is `True` this value will be equal to the length of the given string with `str.rstrip()` applied)

Let us take the example from Quick usage.
```javascript
alert(myGrammar.parse('hello "Iris"').pos);  // alerts 0
```

### Tree
`tree` contains the parse tree. Even when `isValid` is `False` the parse tree is returned but will only contain results as far as parsing has succeeded. The tree is the root node which can include several `children` nodes. The structure will be further clarified in the example found in the "example" folder. It explains a way of visualizing the parse tree.

The nodes in the example contain 5 properties:

- `start` property returns the start of the node object.
- `end` property returns the end of the  node object.
- `element` returns the type of [Element](#elements) (e.g. Repeat, Sequence, Keyword, etc.).
- `string` returns the string that is parsed.
- `children` can return a node object containing deeper layered nodes provided that there are any. In our example the root node has an element type `Repeat()`, starts at 0 and ends at 24, and it has two `children`. These children are node objects that have both an element type `Sequence`, start at 0 and 12 respectively, and so on.


### Expecting
`expecting` returns an array containing elements which jsleri expects at `pos`. Even if `isValid` is true there might be elements in this object, for example when an `Optional()` element could be added to the string. Expecting is useful if you want to implement things like auto-completion, syntax error handling, auto-syntax-correction etc. In the "example" folder you will find an example. Run the html script in a browser. You will see that `expecting` is used to help you create a valid query string for SiriDB. SiriDB is an open source time series database with its own grammar class. Start writing something, click one of the options that appear and see what happens.


## Elements
Jsleri has several Elements which can be used to create a grammar.

### Keyword
```javascript
Keyword(keyword, ignCase)
```
The parser needs to match the keyword which is just a string. When matching keywords we need to tell the parser what characters are allowed in keywords. By default Jsleri uses `^\w+` which equals to `^[A-Za-z0-9_]+`. Keyword() accepts one more argument `ignCase` to tell the parser if we should match case insensitive.

Example:
```javascript
const grammar = new Grammar(
    Keyword('tic-tac-toe', true),   // case insensitive
    '[A-Za-z-]+'                    // alternative keyword matching
);

console.log(grammar.parse('Tic-Tac-Toe').isValid);  // true
```

### Regex
```javascript
Regex(pattern, ignCase)
```
The parser compiles a regular expression. Argument ignCase is set to `false` by default but can be set to `true` if you want the regular expression to be case insensitive. Note that `ignore case` is the only `re` flag from pyleri which will be compiled and accepted by `jsleri`.

See the [Quick Usage](#quick-usage) example for how to use `Regex`.

### Token
```javascript
Token(token)
```
A token can be one or more characters and is usually used to match operators like `+`, `-`, `//` and so on. When we parse a string object where jsleri expects an element, it will automatically be converted to a `Token()` object.

Example:
```javascript
// We could just write '-' instead of Token('-')
// because any string will be converted to Token()
const grammar = new Grammar(List(Keyword('ni'), Token('-')));

console.log(grammar.parse('ni-ni-ni-ni-ni').isValid);  // true
```

### Tokens
```javascript
Tokens(tokens)
```
Can be used to register multiple tokens at once. The tokens argument should be a string with tokens separated by spaces. If given tokens are different in size the parser will try to match the longest tokens first.

Example:
```javascript
const grammar = new Grammar(List(Keyword('ni'), Tokens('+ - !=')));

grammar.parse('ni + ni != ni - ni').isValid  // => True
```

### Sequence
```javascript
Sequence(element, element, ...)
```
The parser needs to match each element in a sequence.

Example:
```javascript
const grammar = new Grammar(Sequence(
    Keyword('Tic'),
    Keyword('Tac'),
    Keyword('Toe')
));
console.log(grammar.parse('Tic Tac Toe').isValid);  // true
```

### Repeat
```javascript
Repeat(element, mi, ma)
```
The parser needs at least `mi` elements and at most `ma` elements. When `ma` is set to `undefined` we allow unlimited number of elements. `mi` can be any integer value equal or higher than 0 but not larger then `ma`. The default value for `mi` is 0 and `undefined` for `ma`

Example:
```javascript
const grammar = new Grammar(Repeat(Keyword('ni')));

console.log(grammar.parse('ni ni ni ni').isValid);  // true
```

One should avoid to bind a name to the same element twice and Repeat(element, 1, 1) is a common solution to bind the element a second (or more) time(s).

For example consider the following:
```javascript
const r_name = Regex('(?:"(?:[^"]*)")+');

// Do NOT do this
const r_address = r_name; // WRONG

// Instead use Repeat
const r_address = Repeat(r_name, 1, 1);  // Correct
```

### List
```javascript
List(element, delimiter, mi, ma, opt)
```
List is like Repeat but with a delimiter. A comma is used as default delimiter but any element is allowed. When a string is used as delimiter it will be converted to a Token element. `mi` and `ma` work excatly like with [Repeat](#repeat). `opt` kan be set to set to `true` to allow the list to end with a delimiter. By default this is set to `false` which means the list has to end with an element.

Example:
```javascript
const grammar = new Grammar(List(Keyword('ni')));

console.log(grammar.parse('ni, ni, ni, ni, ni').isValid);  // true
```

### Optional
```javascript
Optional(element)
```
The parser looks for an optional element. It is like using `Repeat(element, 0, 1)` but we encourage to use `Optional` since it is more readable. (and slightly faster)

Example:
```javascript
const grammar = new Grammar(Sequence(
    Keyword('hi'),
    Optional(Regex('(?:"(?:[^"]*)")+'))
));

console.log(grammar.parse('hi "Iris"').isValid);  // true
console.log(grammar.parse('hi').isValid);  // true
```

### Ref
```javascript
Ref(Constructor)
```
The grammar can make a forward reference to make recursion possible. In the example below we create a forward reference to START but note that
a reference to any element can be made.

>Warning: A reference is not protected against testing the same position in
>in a string. This could potentially lead to an infinite loop.
>For example:
>```javascript
>let r = Ref(Optional);
>r.set(Optional(r));  // DON'T DO THIS
>```
>Use [Prio](#prio) if such recursive construction is required.

Example:
```javascript
// make a forward reference START to a Sequence.
let START = Ref(Sequence);

// we can now use START
const ni_item = Choice(Keyword('ni'), START);

// here we actually set START
START.set(Sequence('[', List(ni_item), ']'));

// create and test the grammar
const grammar = Grammar(START);
console.log(grammar.parse('[ni, [ni, [], [ni, ni]]]').isValid);  // true
```

### Prio
```javascript
Prio(element, element, ...)
```
Choose the first match from the prio elements and allow `THIS` for recursive operations. With `THIS` we point to the `Prio` element. Probably the example below explains how `Prio` and `THIS` can be used.

>Note: Use a [Ref](#ref) when possible.
>A `Prio` element is required when the same position in a string is potentially
>checked more than once.

Example:
```javascript
const grammar = new Grammar(Prio(
    Keyword('ni'),
    Sequence('(', THIS, ')'),
    Sequence(THIS, Keyword('or'), THIS),
    Sequence(THIS, Keyword('and'), THIS)
));

console.log(grammar.parse('(ni or ni) and (ni or ni)').isValid);  // true
```

