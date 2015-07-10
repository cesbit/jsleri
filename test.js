/* jshint newcap: false */

'use strict';

(function (
            Root,
            Keyword,
            Sequence,
            Optional,
            Regex,
            Prio,
            THIS
        ) {

    var k_and = Keyword('and');
    var k_or = Keyword('or');
    var k_this = Keyword('this');
    var k_that = Keyword('that');
    var k_is = Keyword('is');
    var k_timeit = Keyword('timeit');
    var k_select = Keyword('select');
    var k_from = Keyword('from');
    var r_uuid = Regex('[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{12}');


    var single_expr = Sequence(k_this, k_is, k_that);

    var expr = Prio(
        k_that,
        Sequence(Regex('\\('), THIS, Regex('\\)')),
        Sequence(THIS, k_and, THIS),
        Sequence(THIS, k_or, THIS)
    );

    var stmt = Sequence(Optional(k_timeit), expr);


    window.grammer = Root(expr, '[a-z_]+');
})(
    window.lrparsing.Root,
    window.lrparsing.Keyword,
    window.lrparsing.Sequence,
    window.lrparsing.Optional,
    window.lrparsing.Regex,
    window.lrparsing.Prio,
    window.lrparsing.THIS
    );


(function (grammer) {
    var start = +new Date();
    console.log(grammer.parse('that and that'));
    console.log(grammer.parse(' this bla bla'));
    console.log(grammer.parse(' timeit   select  bla'));
    console.log(grammer.parse('tmeit select'));
    console.log(grammer.parse('  select 00dda9e4-20be-11e5-965f-080027f37001 from'));
    var a = grammer.parse('that and that or (that and that)');
    console.log(a.isValid, +new Date() - start);
})(window.grammer);

