/* jshint newcap: false */

/*
 * This grammar is generated using the Grammar.export_js() method and
 * should be used with the jsleri JavaScript module.
 *
 * Source class: JsonGrammar
 * Created at: 2016-05-20 10:51:17
 */

'use strict';

(function (
            List,
            Token,
            Regex,
            Keyword,
            Sequence,
            Choice,
            Ref,
            Grammar
        ) {
    var START = Ref(Choice);
    var r_string = Regex('^(")(?:(?=(\\\\?))\\2.)*?\\1');
    var r_float = Regex('^-?[0-9]+\\.?[0-9]+');
    var r_integer = Regex('^-?[0-9]+');
    var k_true = Keyword('true');
    var k_false = Keyword('false');
    var k_null = Keyword('null');
    var json_map_item = Sequence(
        r_string,
        Token(':'),
        START
    );
    var json_map = Sequence(
        Token('{'),
        List(json_map_item, Token(','), 0, undefined, false),
        Token('}')
    );
    var json_array = Sequence(
        Token('['),
        List(START, Token(','), 0, undefined, false),
        Token(']')
    );
    Object.assign(START, Choice(
        r_string,
        r_float,
        r_integer,
        k_true,
        k_false,
        k_null,
        json_map,
        json_array
    ));

    window.JsonGrammar = Grammar(START, '^\\w+');

})(
    window.jsleri.List,
    window.jsleri.Token,
    window.jsleri.Regex,
    window.jsleri.Keyword,
    window.jsleri.Sequence,
    window.jsleri.Choice,
    window.jsleri.Ref,
    window.jsleri.Grammar
);



(function (Grammar) {
    window.console.log(Grammar.parse('{"hoi \\"Iris\\"": .5}'));

})(window.JsonGrammar);
