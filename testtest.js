'use strict';

(function (
            Regex,
            Sequence,
            Keyword,
            Grammar,
            Repeat,
            Choice,
            EndOfStatement
        ) {

    var k_name = Keyword('iris');
    var k_othername = Keyword('pyleri');
    var k_hi = Keyword('hi');
    var k_bye = Keyword('bye');
    var START = Repeat(Sequence(Choice(k_hi, k_bye), Choice(k_name, k_othername)));

    // window.MyGrammar = Grammar(START, '^\w+');
    window.MyGrammar = Grammar(START);

})(
    window.jsleri.Regex,
    window.jsleri.Sequence,
    window.jsleri.Keyword,
    window.jsleri.Grammar,
    window.jsleri.Repeat,
    window.jsleri.Choice,
    window.jsleri.EndOfStatement
);


function Option()
{
    var string = document.getElementById("string").value;
    var node = window.MyGrammar.parse(string);
    var stringExpecting = (node.isValid ? '\nString is valid. \nExpected: ' : '\nString is NOT valid. \nExpected: ');

    console.log('Parsed string: ', node.tree.str);

    var expect = [];
    for (var e in node.expecting){
        expect.push((node.expecting[e]['keyword'] ? node.expecting[e]['keyword'] : node.expecting[e]['e']));
    }

    var html = '<option type= "text" value="">' + stringExpecting + '</option>';
    for (var e in expect){
         html += '<option type= "text" value= ' +  expect[e] + ' >' + expect[e] + '</option>';
    }
    document.getElementById("option").innerHTML = html;
}

function Select()
{
    var string = document.getElementById("string").value;
    var pos = window.MyGrammar.parse(string).pos;
    var selected = document.getElementById("option").value;
    document.getElementById('string').value = string.substring(0, pos) + ' ' + selected;
}

// function AutoCorrection(string)
// {
//     var node = window.MyGrammar.parse(string);
//     var stringExpecting = (node.isValid ? '\nString is valid. \nExpected: ' : '\nString is NOT valid. \nExpected: ');

//     console.log('Parsed string: ', node.tree.str);
//     console.log(stringExpecting);
//     console.log(node.expecting);

//     var expect = [];
//     for (var e in node.expecting){
//         expect.push((node.expecting[e]['keyword'] ? node.expecting[e]['keyword'] : node.expecting[e]['e']));
//     }
//     return {'position': node.pos, 'expecting': expect};
// }

// function Option()
// {
//     var string = document.getElementById("string").value;
//     var expect = AutoCorrection(string)['expecting'];
//     var html = '<option type= "text" value="">Select keyword</option>';
//     for (var e in expect){
//          html += '<option type= "text" value= ' +  expect[e] + ' >' + expect[e] + '</option>';
//     }
//     document.getElementById("option").innerHTML = html;
// }

// function Select()
// {
//     var string = document.getElementById("string").value;
//     var pos = AutoCorrection(string)['position']
//     var selected = document.getElementById("option").value;
//     document.getElementById('string').value = string.substring(0, pos) + ' ' + selected;
// }
