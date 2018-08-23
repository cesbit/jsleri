'use strict';

function nodeProps(node, children) {
    return {
        'start': node.start,
        'end': node.end,
        'element': node.element.constructor.name,
        'string': node.str,
        'children': children
    }
}

function getChildren(children) {
    var Props = []
    for (var c in children) {
        Props.push(nodeProps(children[c], getChildren(children[c].children)));
    }
    return Props;
}

function ViewParseTree(res) {
    var start = (res.tree.children[0] ? res.tree.children[0] : res.tree);
    return nodeProps(start, getChildren(start.children));
}

function updateTree() {
    var string = document.getElementById("string").value;
    var res = window.SiriGrammar.parse(string);
    var json = ViewParseTree(res);
    var html = JSON.stringify(json, null, '   ');//.replace(/\\"/g, '"');
    document.getElementById('json').innerHTML = html;
}

