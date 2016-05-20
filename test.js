/* jshint newcap: false */

/*
 * This grammar is generated using the Grammar.export_js() method and
 * should be used with the jsleri JavaScript module.
 *
 * Source class: _TestGrammar4
 * Created at: 2016-05-20 00:29:31
 */

'use strict';

(function (
            List,
            Grammar,
            Keyword,
            Token,
            Sequence,
            Choice,
            Ref
        ) {
    var START = Ref(Sequence);
    var ni_item = Choice(
        Keyword('ni'),
        START
    );
    Object.assign(START, Sequence(
        Token('['),
        List(ni_item, Token(','), 0, undefined, false),
        Token(']')
    ));

    window._TestGrammar4 = Grammar(START, '^\\w+');

})(
    window.jsleri.List,
    window.jsleri.Grammar,
    window.jsleri.Keyword,
    window.jsleri.Token,
    window.jsleri.Sequence,
    window.jsleri.Choice,
    window.jsleri.Ref
);

(function (Grammar) {
    window.console.log(Grammar.parse('[ni, ni, [ni, [], [ni, ni]]'));

})(window._TestGrammar4);
