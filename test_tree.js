'use strict';

(function (
            Regex,
            Sequence,
            Keyword,
            Grammar,
            Repeat,
            Choice
        ) {
    var r_name = Regex('^(?:"(?:[^"]*)")+');
    var k_hi = Keyword('hi');
    var k_bye = Keyword('bye');
    var START = Repeat(Sequence(Choice(k_hi, k_bye), r_name));

    // window.MyGrammar = Grammar(START, '^\w+');
    window.MyGrammar = Grammar(START);

})(
    window.jsleri.Regex,
    window.jsleri.Sequence,
    window.jsleri.Keyword,
    window.jsleri.Grammar,
    window.jsleri.Repeat,
    window.jsleri.Choice
);

function nodeProps(node, children)
{
    return {
        'start': node.start,
        'end': node.end,
        //'name': node.element.name,
        'elemnt': node.element.constructor.name,
        'string': node.str,
        'children': children
    }
}

function getChildren(children)
{
    var Props = []
    for (var c in children){
        Props.push(nodeProps(children[c], getChildren(children[c].children)));
    }
    return Props;
}

function ViewParseTree(res)
{
    var start = (res.tree.children[0] ? res.tree.children[0] : res.tree);
    return nodeProps(start, getChildren(start.children));
}

var res = window.MyGrammar.parse('hi "pyleri" bye "pyleri"');
//document.write(res.isValid, '\n', res.pos);
var tree = (res.tree.children[0] ? res.tree.children[0] : res.tree);
console.log(tree);


console.log(ViewParseTree(res));
var json = ViewParseTree(res);
var html = JSON.stringify(json, null, '   ').replace(/\\"/g, '"');
document.getElementById('json').innerHTML = html;
