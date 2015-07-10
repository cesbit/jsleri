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

    var k_and = new Keyword('and');
    var k_or = new Keyword('or');
    var k_this = new Keyword('this');
    var k_that = new Keyword('that');
    var k_is = new Keyword('is');
    var k_timeit = new Keyword('timeit');
    var k_select = new Keyword('select');
    var k_from = new Keyword('from');
    var r_uuid = new Regex('[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{12}');


    var single_expr = new Sequence(k_this, k_is, k_that);

    var expr = new Prio(
        single_expr,
        new Sequence(THIS, k_and, THIS),
        new Sequence(THIS, k_or, THIS)
    );

    var stmt = new Sequence(new Optional(k_timeit), k_select, r_uuid, expr, new Optional(k_from));


    window.grammer = new Root(stmt, '[a-z_]+');
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
    console.log(grammer.parse(' timeit   select 00dda9e4-20be-11e5-965f-080027f37001 this is that and this is that and this is that or this is that from'));
    console.log(grammer.parse(' timeit   select 00dda9e4-20be-11e5-965f-080027f37001 this is that'));
    console.log(grammer.parse(' timeit   select  bla'));
    console.log(grammer.parse('tmeit select'));
    console.log(grammer.parse('  select 00dda9e4-20be-11e5-965f-080027f37001 from'));
})(window.grammer);

