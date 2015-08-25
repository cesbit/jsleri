/* jshint newcap: false */

'use strict';

(function (
            Choice,
            Keyword,
            List,
            Optional,
            Prio,
            Regex,
            Root,
            Sequence,
            Token,
            Tokens,
            THIS
        ) {

    var r_uuid_str = Regex('[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{12}'),
        r_integer = Regex('[0-9]+'),
        r_time_str = Regex('[0-9]+(ms|[smhd])'),
        r_singleq_str = Regex('(?:\'(?:[^\']*)\')+'),
        r_doubleq_str = Regex('(?:"(?:[^"]*)")+'),
        r_grave_str = Regex('(?:`(?:[^`]*)`)+'),
        r_regex = Regex('(/[^/\\\\]*(?:\\\\.[^/\\\\]*)*/i?)'),
        r_comment = Regex('#.*');

    var k_access = Keyword('access'),
        k_address = Keyword('address'),
        k_after = Keyword('after'),
        k_alter = Keyword('alter'),
        k_and = Keyword('and'),
        k_as = Keyword('as'),
        k_before = Keyword('before'),
        k_buffer_size = Keyword('buffer_size'),
        k_buffer_path = Keyword('buffer_path'),
        k_between = Keyword('between'),
        k_cached = Keyword('cached'),
        k_comment = Keyword('comment'),
        k_continue = Keyword('continue'),
        k_count = Keyword('count'),
        k_create = Keyword('create'),
        k_database = Keyword('database'),
        k_dbname = Keyword('dbname'),
        k_dbpath = Keyword('dbpath'),
        k_debug = Keyword('debug') ,
        k_drop = Keyword('drop'),
        k_end = Keyword('end'),
        k_expression = Keyword('expression'),
        k_false = Keyword('false'),
        k_first = Keyword('first'),
        k_for = Keyword('for'),
        k_from = Keyword('from'),
        k_full = Keyword('full'),
        k_grant = Keyword('grant'),
        k_group = Keyword('group'),
        k_groups = Keyword('groups'),
        k_help = Choice(Keyword('help'), Token('?')),
        k_indexed = Keyword('indexed'),
        k_insert = Keyword('insert'),
        k_length = Keyword('length'),
        k_last = Keyword('last'),
        k_license = Keyword('license'),
        k_limit = Keyword('limit'),
        k_list = Keyword('list'),
        k_loglevel = Keyword('loglevel'),
        k_max = Keyword('max'),
        k_max_cache_expressions = Keyword('max_cache_expressions'),
        k_mean = Keyword('mean'),
        k_median = Keyword('median'),
        k_median_low = Keyword('median_low'),
        k_median_high = Keyword('median_high'),
        k_mem_usage = Keyword('mem_usage'),
        k_merge = Keyword('merge'),
        k_min = Keyword('min'),
        k_modify = Keyword('modify'),
        k_name = Keyword('name'),
        k_network = Keyword('network'),
        k_networks = Keyword('networks'),
        k_now = Keyword('now'),
        k_online = Keyword('online'),
        k_open_files = Keyword('open_files'),
        k_or = Keyword('or'),
        k_overlap = Keyword('overlap'),
        k_password = Keyword('password'),
        k_pause = Keyword('pause'),
        k_points = Choice(Keyword('points'), Token('*')),
        k_pool = Keyword('pool'),
        k_pools = Keyword('pools'),
        k_port = Keyword('port'),
        k_prefix = Keyword('prefix'),
        k_python = Keyword('python'),
        k_queries_timeout = Keyword('queries_timeout'),
        k_read = Keyword('read'),
        k_reindex_progress = Keyword('reindex_progress'),
        k_revoke = Keyword('revoke'),
        k_select = Keyword('select'),
        k_series = Keyword('series'),
        k_server = Keyword('server'),
        k_servers = Keyword('servers'),
        k_set = Keyword('set'),
        k_shard = Keyword('shard'),
        k_sharding_buffering = Keyword('sharding_buffering'),
        k_sharding_duration = Keyword('sharding_duration'),
        k_sharding_max_chunk_points = Keyword('sharding_max_chunk_points'),
        k_sharding_max_open_files = Keyword('sharding_max_open_files'),
        k_shards = Keyword('shards'),
        k_show = Keyword('show'),
        k_sid = Keyword('sid'),
        k_size = Keyword('size'),
        k_start =  Keyword('start'),
        k_startup_time = Keyword('startup_time'),
        k_status = Keyword('status'),
        k_suffix = Keyword('suffix'),
        k_sum = Keyword('sum'),
        k_sync_progress = Keyword('sync_progress'),
        k_task_queue = Keyword('task_queue'),
        k_timeit = Keyword('timeit'),
        k_time_precision = Keyword('time_precision'),
        k_to = Keyword('to'),
        k_tornado_server = Keyword('tornado_server'),
        k_true = Keyword('true'),
        k_type = Keyword('type'),
        k_uptime = Keyword('uptime'),
        k_user = Keyword('user'),
        k_users = Keyword('users'),
        k_using = Keyword('using'),
        k_uuid = Keyword('uuid'),
        k_version = Keyword('version'),
        k_where = Keyword('where'),
        k_who_am_i = Keyword('who_am_i'),
        k_write = Keyword('write');

    var access_keywords = Choice(
        k_read,
        k_write,
        k_modify,
        k_full,
        k_select,
        k_show,
        k_list,
        k_count,
        k_create,
        k_insert,
        k_drop,
        k_grant,
        k_revoke,
        k_alter,
        k_pause,
        k_continue
    );

    var int_expr = Prio(
        r_integer,
        Sequence('(', THIS, ')'),
        Sequence(THIS, Tokens('+ - * //'), THIS)
    );

    var string = Choice(r_singleq_str, r_doubleq_str);

    var time_expr = Prio(
        r_time_str,
        k_now,
        string,
        r_integer,
        Sequence('(', THIS, ')'),
        Sequence(THIS, Tokens('+ - * //'), THIS),
        Sequence('-', r_integer)
    );

    var series_props = Choice(
        k_name,
        k_type,
        k_length,
        k_start,
        k_end,
        k_first,
        k_last,
        k_overlap,
        k_pool
    );
    var series_columns = List(series_props, ',', 1);

    var shard_props = Choice(
        k_sid,
        k_size,
        k_start,
        k_end
    );
    var shard_columns = List(shard_props, ',', 1);

    var server_props = Choice(
        k_address,
        k_name,
        k_port,
        k_uuid,
        k_pool,
        k_version,
        k_online,
        k_status
    );
    var server_columns = List(server_props, ',', 1);

    var group_props = Choice(
        k_cached,
        k_expression,
        k_indexed,
        k_name,
        k_series
    );
    var group_columns = List(group_props, ',', 1);

    var user_props = Choice(
        k_user,
        k_access
    );
    var user_columns = List(user_props, ',', 1);

    var network_props = Choice(
        k_network,
        k_access,
        k_comment
    );
    var network_columns = List(network_props, ',', 1);

    var pool_props = Choice(
        k_pool,
        k_servers,
        k_series
    );
    var pool_columns = List(pool_props, ',', 1);


    var where_operator = Choice(
        Tokens('== != < > <= >='),
        Keyword('in'),
        Sequence(Keyword('not'), Keyword('in'))
    );

    var where_props = Choice(
        k_access,
        k_address,
        k_cached,
        k_comment,
        k_end,
        k_expression,
        k_first,
        k_indexed,
        k_last,
        k_length,
        k_name,
        k_network,
        k_online,
        k_overlap,
        k_pool,
        k_port,
        k_servers,
        k_series,
        k_sid,
        k_size,
        k_start,
        k_status,
        k_type,
        k_uuid,
        k_user,
        k_version
    );

    var where_opts = Prio(
        time_expr,
        string,
        int_expr,
        k_false,
        k_true,
        where_props
    );

    var where_condition = Sequence(where_opts, where_operator, where_opts);

    var where_expr = Prio(
        where_condition,
        Sequence('(',THIS, ')'),
        Sequence(THIS, k_and, THIS),
        Sequence(THIS, k_or, THIS)
    );

    var where_stmt = Sequence(k_where, where_expr);

    var series_name = string;
    var group_name = r_grave_str;
    var _boolean = Choice(k_true, k_false);
    var series_re = r_regex;
    var uuid = Choice(r_uuid_str, string);
    var group_match = Sequence(group_name, Optional(series_re));
    var series_match = List(Choice(series_name, series_re, group_match), ',', 1);
    var limit_expr = Sequence(k_limit, int_expr);

    var before_expr = Sequence(k_before, time_expr);
    var after_expr = Sequence(k_after, time_expr);
    var between_expr = Sequence(k_between, time_expr, k_and, time_expr);
    var access_expr = List(access_keywords, ',', 1);
    var prefix_expr = Sequence(k_prefix, string);
    var suffix_expr = Sequence(k_suffix, string);
    var mean_expr = Sequence(k_mean, '(', time_expr, ')', Optional(prefix_expr), Optional(suffix_expr));
    var median_expr = Sequence(k_median, '(', time_expr, ')', Optional(prefix_expr), Optional(suffix_expr));
    var median_low_expr = Sequence(k_median_low, '(', time_expr, ')', Optional(prefix_expr), Optional(suffix_expr));
    var median_high_expr = Sequence(k_median_high, '(', time_expr, ')', Optional(prefix_expr), Optional(suffix_expr));
    var sum_expr = Sequence(k_sum, '(', time_expr, ')', Optional(prefix_expr), Optional(suffix_expr));
    var min_expr = Sequence(k_min, '(', time_expr, ')', Optional(prefix_expr), Optional(suffix_expr));
    var max_expr = Sequence(k_max, '(', time_expr, ')', Optional(prefix_expr), Optional(suffix_expr));
    var count_expr = Sequence(k_count, '(', time_expr, ')', Optional(prefix_expr), Optional(suffix_expr));
    var points_expr = Sequence(k_points, Optional(prefix_expr), Optional(suffix_expr));

    var aggregate_expressions = Choice(
        points_expr,
        mean_expr,
        median_expr,
        median_low_expr,
        median_high_expr,
        sum_expr,
        min_expr,
        max_expr,
        count_expr
    );
    var aggregate_expression = List(aggregate_expressions, ',', 1);

    var merge_expr = Sequence(k_merge, k_as, string, Optional(Sequence(k_using, Choice(
        k_mean,
        k_median,
        k_median_low,
        k_median_high,
        k_sum,
        k_min,
        k_max,
        k_count
    ), '(', time_expr, ')')));

    var set_comment_expr = Sequence(k_set, k_comment, string),
        set_password_expr = Sequence(k_set, k_password, string),
        set_indexed_expr = Sequence(k_set, k_indexed, _boolean),
        set_address_expr = Sequence(k_set, k_address, string),
        set_port_expr = Sequence(k_set, k_port, r_integer),
        set_license_expr = Sequence(k_set, k_license, string),
        set_debug_expr = Sequence(k_set, k_debug, _boolean),
        set_loglevel_expr = Sequence(k_set, k_loglevel, string),
        set_series_name_expr = Sequence(k_set, k_name, string);

    var alter_user_stmt = Sequence(k_user, string, set_password_expr),
        alter_network_stmt = Sequence(k_network, string, set_comment_expr),
        alter_group_stmt = Sequence(k_group, group_name, set_indexed_expr),
        alter_server_stmt = Sequence(k_server, uuid, Choice(set_address_expr, set_port_expr, set_debug_expr, set_loglevel_expr)),
        alter_database_stmt = Sequence(k_database, set_license_expr),
        alter_series_stmt = Sequence(k_series, series_name, set_series_name_expr);

    var count_groups_stmt = k_groups,
        count_networks_stmt = k_networks,
        count_pools_stmt = k_pools,
        count_series_stmt = Sequence(k_series, Optional(series_match)),
        count_servers_stmt = k_servers,
        count_shards_stmt = k_shards,
        count_users_stmt = k_users;

    var create_group_stmt = Sequence(k_group, group_name, k_for, r_regex, Optional(set_indexed_expr)),
        create_user_stmt = Sequence(k_user, string, set_password_expr),
        create_network_stmt = Sequence(k_network, string, Optional(set_comment_expr));

    var drop_group_stmt = Sequence(k_group, group_name),
        drop_series_stmt = Sequence(k_series, Choice(series_match, where_stmt, Sequence(series_match, where_stmt))),
        drop_shard_stmt = Sequence(k_shard, r_integer),
        drop_server_stmt = Sequence(k_server, uuid),
        drop_user_stmt = Sequence(k_user, string),
        drop_network_stmt = Sequence(k_network, string);

    var grant_user_stmt = Sequence(k_user, string, Optional(set_password_expr)),
        grant_network_stmt = Sequence(k_network, string, Optional(set_comment_expr));

    var list_groups_stmt = Sequence(k_groups, Optional(group_columns)),
        list_networks_stmt = Sequence(k_networks, Optional(network_columns)),
        list_pools_stmt = Sequence(k_pools, Optional(pool_columns)),
        list_series_stmt = Sequence(k_series, Optional(series_columns), Optional(series_match)),
        list_servers_stmt = Sequence(k_servers, Optional(server_columns)),
        list_shards_stmt = Sequence(k_shards, Optional(shard_columns)),
        list_users_stmt = Sequence(k_users, Optional(user_columns));

    var revoke_user_stmt = Sequence(k_user, string),
        revoke_network_stmt = Sequence(k_network, string);

    var alter_stmt = Sequence(k_alter, Choice(
        alter_user_stmt,
        alter_network_stmt,
        alter_group_stmt,
        alter_server_stmt,
        alter_database_stmt,
        alter_series_stmt
    ));
    var calc_stmt = time_expr;
    var continue_stmt = Sequence(k_continue, uuid);
    var count_stmt = Sequence(k_count, Choice(
        count_groups_stmt,
        count_networks_stmt,
        count_pools_stmt,
        count_series_stmt,
        count_servers_stmt,
        count_shards_stmt,
        count_users_stmt
    ), Optional(where_stmt));
    var create_stmt = Sequence(k_create, Choice(
        create_group_stmt,
        create_user_stmt,
        create_network_stmt
    ));
    var drop_stmt = Sequence(k_drop, Choice(
        drop_group_stmt,
        drop_series_stmt,
        drop_shard_stmt,
        drop_server_stmt,
        drop_user_stmt,
        drop_network_stmt
    ));
    var grant_stmt = Sequence(k_grant, access_expr, k_to, Choice(
        grant_user_stmt,
        grant_network_stmt
    ));
    var list_stmt = Sequence(k_list, Choice(
        list_series_stmt,
        list_users_stmt,
        list_networks_stmt,
        list_shards_stmt,
        list_groups_stmt,
        list_servers_stmt,
        list_pools_stmt
    ), Optional(where_stmt), Optional(limit_expr));
    var pause_stmt = Sequence(k_pause, uuid);
    var revoke_stmt = Sequence(k_revoke, access_expr, k_from, Choice(
        revoke_user_stmt,
        revoke_network_stmt
    ));
    var select_stmt = Sequence(
        k_select,
        aggregate_expression,
        k_from,
        series_match,
        Optional(where_stmt),
        Optional(merge_expr),
        Optional(Choice(before_expr, after_expr, between_expr))
    );
    var show_stmt = Sequence(k_show, Optional(Choice(
        k_buffer_size,
        k_buffer_path,
        k_dbname,
        k_dbpath,
        k_debug,
        k_license,
        k_loglevel,
        k_max_cache_expressions,
        k_mem_usage,
        k_open_files,
        k_pool,
        k_python,
        k_queries_timeout,
        k_reindex_progress,
        k_server,
        k_sharding_buffering,
        k_sharding_duration,
        k_sharding_max_chunk_points,
        k_sharding_max_open_files,
        k_startup_time,
        k_status,
        k_sync_progress,
        k_task_queue,
        k_time_precision,
        k_tornado_server,
        k_uptime,
        k_uuid,
        k_version,
        k_who_am_i
    )));

    var help = Sequence(k_help, Optional(Choice(
        Sequence(k_list, Optional(Choice(
            k_servers,
            k_users,
            k_networks,
            k_pools
        ))),
        k_pause,
        k_continue,
        k_timeit
    )));

    var stmt = Sequence(Optional(k_timeit), Choice(
        alter_stmt,
        continue_stmt,
        count_stmt,
        create_stmt,
        drop_stmt,
        grant_stmt,
        list_stmt,
        pause_stmt,
        revoke_stmt,
        select_stmt,
        show_stmt,
        calc_stmt,
        help
    ), Optional(r_comment));

    window.siriGrammer = Root(stmt, '[a-z_]+');
})(
    window.lrparsing.Choice,
    window.lrparsing.Keyword,
    window.lrparsing.List,
    window.lrparsing.Optional,
    window.lrparsing.Prio,
    window.lrparsing.Regex,
    window.lrparsing.Root,
    window.lrparsing.Sequence,
    window.lrparsing.Token,
    window.lrparsing.Tokens,
    window.lrparsing.THIS
);