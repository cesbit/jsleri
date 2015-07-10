'use strict';

(function (
            Root,
            Keyword,
            Sequence,
            Optional,
            Regex
        ) {

    var k_timeit = new Keyword('timeit');
    var k_select = new Keyword('select');
    var k_from = new Keyword('from');
    var r_uuid = new Regex(/[0-9a-f]{8}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{4}\-[0-9a-f]{12}/);

    var stmt = new Sequence(new Optional(k_timeit), k_select, new Optional(k_from));

    window.grammer = new Root(stmt);
})(
    window.lrparsing.Root,
    window.lrparsing.Keyword,
    window.lrparsing.Sequence,
    window.lrparsing.Optional,
    window.lrparsing.Regex
    );


(function (grammer) {
    console.log(grammer.parse(' timeit   select'));
    console.log(grammer.parse(' timeit   select  bla'));
    console.log(grammer.parse('tmeit select'));
    console.log(grammer.parse('  select from'));
})(window.grammer);