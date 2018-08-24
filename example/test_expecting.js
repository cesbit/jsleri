'use strict';

// Gets a string from the input form, checks if it's valid and forms and "expected" list that is returned as html.
function Option() {
    var string = document.getElementById("string").value;
    var node = window.SiriGrammar.parse(string);
    var isvalid = (node.isValid ? 'Valid' : 'Not valid');
    console.log('Parsed string: ', node.tree.str);

    // create the "expecting" list. In case of a regex return a description and example.
    var expect = [];
    for (var e in node.expecting) {
        node.expecting[e]['keyword'] ? expect.push(node.expecting[e]['keyword'])
        : node.expecting[e]['e'] ? expect.push(node.expecting[e]['e'])
        : node.expecting[e]['token'] ? expect.push(node.expecting[e]['token'])
        : node.expecting[e]['re'] ? expect.push(
            node.expecting[e]['re'] == '^[-+]?[0-9]*\\.?[0-9]+'  ? 'float (e.g. 3.56)'
            : node.expecting[e]['re'] == '^[-+]?[0-9]+'            ? 'integer (e.g. -3 or 3)'
            : node.expecting[e]['re'] == '^[0-9]+'                 ? 'unidentified integer (e.g. 3)'
            : node.expecting[e]['re'] == '^[0-9]+[smhdw]'          ? 'time (e.g. 3s)'
            : node.expecting[e]['re'] == '^(?:\'(?:[^\']*)\')+'    ? 'single quote string (e.g. \'series\')'
            : node.expecting[e]['re'] == '^(?:"(?:[^"]*)")+'       ? 'double qoute string (e.g. "series")'
            : node.expecting[e]['re'] == '^(?:`(?:[^`]*)`)+'       ? 'grave string (e.g. `my_series`)'
            : node.expecting[e]['re'] == '^[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{12}'  ? 'uuid (e.g. 2b1deaec-f563-40c2-9542-4697b393c226)'
            : node.expecting[e]['re'] == '^(/[^/\\\\]*(?:\\\\.[^/\\\\]*)*/i?)'      ? 'regex (e.g. /series.*/)'
            : node.expecting[e]['re'] == '^#.*'                    ? 'comment (e.g. # siriDB)'
            : null
        )
        : null
    }

    // Put the expected objects in an html list.
    var htmlExpect = '';
    for (var e in expect.sort()) {
        htmlExpect += '<li class="selected" onclick="Select(this)"><span class="grey"></span><span>' + expect[e] + '</span></li>';
    }
    document.getElementById("option").innerHTML = htmlExpect;
    document.getElementById("isvalid").innerHTML = '<h3>' + isvalid + '</h3>';
}

// Get the selected item out of the html list and put it in the input field for parsing. In case of a regex return the example.
function Select(id) {
    var string = document.getElementById("string").value;
    var pos = window.SiriGrammar.parse(string).pos;
    var selected = (
        id.innerText == 'float (e.g. 3.56)'                                  ? '3.56'
        : id.innerText == 'integer (e.g. -3 or 3)'                           ? '-3'
        : id.innerText == 'unidentified integer (e.g. 3)'                    ? '3'
        : id.innerText == 'time (e.g. 3s)'                                   ? '3s'
        : id.innerText == 'single quote string (e.g. \'series\')'            ? ' \'series\''
        : id.innerText == 'double qoute string (e.g. "series")'              ? '"series"'
        : id.innerText == 'grave string (e.g. `my_series`)'                  ? '`my_series`'
        : id.innerText == 'uuid (e.g. 2b1deaec-f563-40c2-9542-4697b393c226)' ? '2b1deaec-f563-40c2-9542-4697b393c226'
        : id.innerText == 'regex (e.g. /series.*/)'                          ? '/series.*/'
        : id.innerText == 'comment (e.g. # siriDB)'                          ? '# siriDB'
        : id.innerText
    );
    document.getElementById("string").value = string.substring(0, pos) + ' ' + selected;
}
