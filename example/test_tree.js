'use strict';

// Node properties
function nodeProps(node, children) {
    return {
        'start': node.start,
        'end': node.end,
        'element': node.element.constructor.name,
        'string': node.str,
        'children': children
    }
}

// Recursive function to get al the children.
function getChildren(children) {
    var Props = []
    for (var c in children) {
        Props.push(nodeProps(children[c], getChildren(children[c].children)));
    }
    return Props;
}

// Forms the parse tree.
function ParseTree(res) {
    var start = (res.tree.children[0] ? res.tree.children[0] : res.tree);
    return nodeProps(start, getChildren(start.children));
}

// Gets a string from the input field and returns the parse tree in JSON format.
function updateTree() {
    var string = document.getElementById("string").value;
    var res = window.SiriGrammar.parse(string);
    var json = ParseTree(res);
    var html = JSON.stringify(json, null, '   ');//.replace(/\\"/g, '"');
    document.getElementById('json').innerHTML = html;
}

