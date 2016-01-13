Javascript Left-Right Parser
============================

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
The parser needs to choose between one of the given elements. Choice accepts one keyword argument `most_greedy` which is `True` by default. When `most_greedy` is set to `False` the parser will stop at the first match. When `True` the parser will try each element and returns the longest match. Settings `most_greedy` to `False` can provide some extra performance. Note that the parser will try to match each element in the exact same order they are parsed to Choice.

Example: let us use `Choice` to modify the Quick usage example to allow the string 'bye "Iris"'
```javascript
var r_name = jsleri.Regex('(?:"(?:[^"]*)")+'),
    k_hi = jsleri.Keyword('hi'),
    k_bye = jsleri.Keyword('bye'),
    START = jsleri.Sequence(jsleri.Choice(k_hi, k_bye), r_name),
    grammar = jsleri.Grammar(START);

grammar.parse('hi "Iris"').isValid  // => True
grammar.parse('bye "Iris"').isValid  // => True    
```
