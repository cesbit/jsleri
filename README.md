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
In real word you would probably want to write a separate grammar file. One way to this is show here...
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
