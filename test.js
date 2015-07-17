/* jshint newcap: false */

'use strict';

(function (
            Choice,
            Keyword,
            List,
            Optional,
            Prio,
            Regex,
            Repeat,
            Root,
            Sequence,
            Token,
            Tokens,
            THIS
        ) {


    var k_and = Keyword('and');
    // console.log('k_and', k_and instanceof Keyword);
    var k_or = Keyword('or');
    var k_this = Keyword('this');
    var k_that = Keyword('that');
    var k_timeit = Keyword('timeit');
    var k_list = Keyword(
        'list',
        function (node) {
            console.log('enter k_list...', node);
        },
        function (node) {
            console.log('exit k_list...', node);
        }
    );
    // console.log('k_list', k_list instanceof Keyword);
    var k_users = new Keyword(
        'users',
        function (node) {
            console.log('enter k_users...', node);
        }
    );
    var k_networks = Keyword('networks');
    // var r_uuid = Regex('[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{12}');


    // var single_expr = Sequence(k_this, Tokens('> < >= <= == !='), k_that);

    // var expr = Prio(
    //     single_expr,
    //     Sequence('(', THIS, ')'),
    //     Sequence(THIS, k_and, THIS),
    //     Sequence(THIS, k_or, THIS),
    // );

    // var stmt = Sequence(Optional(k_timeit), k_list, Choice(k_users, k_networks, expr), List(k_that, ',', 1), Optional(k_this));

    var stmt = Sequence(k_list, Choice(k_users, k_networks), function (node) {
        console.log('enter stmt', node);
    }, function (node) {
        console.log('exit stmt', node);
    });
    // console.log('stmt', stmt instanceof Sequence);
    window.grammer = Root(stmt);
})(
    window.lrparsing.Choice,
    window.lrparsing.Keyword,
    window.lrparsing.List,
    window.lrparsing.Optional,
    window.lrparsing.Prio,
    window.lrparsing.Regex,
    window.lrparsing.Repeat,
    window.lrparsing.Root,
    window.lrparsing.Sequence,
    window.lrparsing.Token,
    window.lrparsing.Tokens,
    window.lrparsing.THIS
);


(function (grammer, siriGrammer) {
    var start = +new Date();
    var parseResult;
    // window.console.log(siriGrammer.parse('timeit select * from "series-001"'));
    // window.console.log(siriGrammer.parse('select sum(4h) from `messagehubs`/.*influx.*/i merge as "Records streamed per 4 hours to SiriDB in last 28 days" using sum(1 + 5 - 6) after now - 28d'));
    // parseResult = siriGrammer.parse('help list server');
    // parseResult.tree.walk();

    parseResult = grammer.parse('list users');
    parseResult.tree.walk();
    window.console.log(parseResult);
    // window.console.log(grammer.parse('list this<that and(this == that or this < that) that, that'));
    // window.console.log(grammer.parse('timeit list that and that'));
    // window.console.log(grammer.parse('tmeit select'));
    // window.console.log(grammer.parse('  select 00dda9e4-20be-11e5-965f-080027f37001 from'));
    // var a = grammer.parse('that and that or (that and that)');
    // window.console.log(a.isValid, +new Date() - start);
})(window.grammer, window.siriGrammer);

// select sum(4h) from `messagehubs`/.*influx.*/i merge as "Records streamed per 4 hours to SiriDB in last 28 days" using sum(1 + 5 - 6) afte now - 28d
'list this<that and(this == that or this < that) that, that, that this this this'
// timeit select * from "series-001"
