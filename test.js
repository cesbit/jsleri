/* jshint newcap: false */

/*
 * This grammar is generated using the Grammar.export_js() method and
 * should be used with the jsleri JavaScript module.
 *
 * Source class: _TestGrammar4
 * Created at: 2016-05-20 08:29:34
 */

'use strict';

(function (
            Sequence,
            Choice,
            Token,
            List,
            Ref,
            Grammar,
            Keyword
        ) {
    var START = Ref(Sequence),
        ni_item = Choice(Keyword('ni'), START),
        ni_seq = Sequence('[', List(ni_item), ']');
    Object.assign(START, ni_seq);

    window._TestGrammar4 = Grammar(START);

})(
    window.jsleri.Sequence,
    window.jsleri.Choice,
    window.jsleri.Token,
    window.jsleri.List,
    window.jsleri.Ref,
    window.jsleri.Grammar,
    window.jsleri.Keyword
);


(function (Grammar) {
    window.console.log(Grammar.parse('[ni, ni, [ni, [], [ni, ni]]'));

})(window._TestGrammar4);
