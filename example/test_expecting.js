'use strict';

function Option() {
    var string = document.getElementById("string").value;
    var node = window.SiriGrammar.parse(string);
    var isvalid = (node.isValid ? 'Valid' : 'Not valid');
    console.log('Parsed string: ', node.tree.str);
    var expect = [];
    for (var e in node.expecting) {
        node.expecting[e]['keyword'] ? expect.push(node.expecting[e]['keyword'])
        : node.expecting[e]['e'] ? expect.push(node.expecting[e]['e'])
        : node.expecting[e]['token'] ? expect.push(node.expecting[e]['token'])
        : node.expecting[e]['re'] ? expect.push(
            node.expecting[e]['re'] == '^[-+]?[0-9]*\\.?[0-9]+'  ? 'float (i.e. 3.56)'
            : node.expecting[e]['re'] == '^[-+]?[0-9]+'            ? 'integer (i.e. -3 or 3)'
            : node.expecting[e]['re'] == '^[0-9]+'                 ? 'unidentified integer (i.e. 3)'
            : node.expecting[e]['re'] == '^[0-9]+[smhdw]'          ? 'time (i.e. 3s)'
            : node.expecting[e]['re'] == '^(?:\'(?:[^\']*)\')+'    ? 'single quote string (i.e. \'series\')'
            : node.expecting[e]['re'] == '^(?:"(?:[^"]*)")+'       ? 'double qoute string (i.e. "series")'
            : node.expecting[e]['re'] == '^(?:`(?:[^`]*)`)+'       ? 'grave string (i.e. `my_series`)'
            : node.expecting[e]['re'] == '^[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{12}'  ? 'uuid (i.e. 2b1deaec-f563-40c2-9542-4697b393c226)'
            : node.expecting[e]['re'] == '^(/[^/\\\\]*(?:\\\\.[^/\\\\]*)*/i?)'      ? 'regex (i.e. /series.*/)'
            : node.expecting[e]['re'] == '^#.*'                    ? 'comment (i.e. # siriDB)'
            : null
        )
        : null
    }
    var htmlExpect = '';
    for (var e in expect.sort()) {
        htmlExpect += '<li class="selected" onclick="Select(this)"><span class="grey"></span><span>' + expect[e] + '</span></li>';
    }
    document.getElementById("option").innerHTML = htmlExpect;
    document.getElementById("isvalid").innerHTML = '<h3>' + isvalid + '</h3>';
}

function Select(id) {
    var string = document.getElementById("string").value;
    var pos = window.SiriGrammar.parse(string).pos;
    var selected = (
        id.innerText == 'float (i.e. 3.56)'                                  ? '3.56'
        : id.innerText == 'integer (i.e. -3 or 3)'                           ? '-3'
        : id.innerText == 'unidentified integer (i.e. 3)'                    ? '3'
        : id.innerText == 'time (i.e. 3s)'                                   ? '3s'
        : id.innerText == 'single quote string (i.e. \'series\')'            ? ' \'series\''
        : id.innerText == 'double qoute string (i.e. "series")'              ? '"series"'
        : id.innerText == 'grave string (i.e. `my_series`)'                  ? '`my_series`'
        : id.innerText == 'uuid (i.e. 2b1deaec-f563-40c2-9542-4697b393c226)' ? '2b1deaec-f563-40c2-9542-4697b393c226'
        : id.innerText == 'regex (i.e. /series.*/)'                          ? '/series.*/'
        : id.innerText == 'comment (i.e. # siriDB)'                          ? '# siriDB'
        : id.innerText
    );
    document.getElementById("string").value = string.substring(0, pos) + ' ' + selected;
}
