/* jshint newcap: false */

'use strict';

(function (
            Choice,
            Token,
            Rule,
            Optional,
            Prio,
            Tokens,
            Keyword,
            THIS,
            Regex,
            Repeat,
            Sequence,
            List,
            Grammar
        ) {
    var r_integer = Regex('^[0-9]+');
    var r_time_str = Regex('^[0-9]+(ms|[smhd])');
    var r_ident = Regex('^[a-z_]+');
    var r_singleq_str = Regex('^(?:\'(?:[^\']*)\')+');
    var r_doubleq_str = Regex('^(?:"(?:[^"]*)")+');
    var r_grave_str = Regex('^(?:`(?:[^`]*)`)+');
    var r_uuid_str = Regex('^[0-9a-f]{8}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{4}\\-[0-9a-f]{12}');
    var r_regex = Regex('^(/[^/\\\\]*(?:\\\\.[^/\\\\]*)*/i?)');
    var r_comment = Regex('^#.*');
    var k_access = Keyword('access');
    var k_address = Keyword('address');
    var k_after = Keyword('after');
    var k_alter = Keyword('alter');
    var k_and = Keyword('and');
    var k_as = Keyword('as');
    var k_before = Keyword('before');
    var k_buffer_size = Keyword('buffer_size');
    var k_buffer_path = Keyword('buffer_path');
    var k_between = Keyword('between');
    var k_cached = Keyword('cached');
    var k_comment = Keyword('comment');
    var k_continue = Keyword('continue');
    var k_count = Keyword('count');
    var k_create = Keyword('create');
    var k_database = Keyword('database');
    var k_dbname = Keyword('dbname');
    var k_dbpath = Keyword('dbpath');
    var k_debug = Keyword('debug');
    var k_drop = Keyword('drop');
    var k_end = Keyword('end');
    var k_expression = Keyword('expression');
    var k_false = Keyword('false');
    var k_first = Keyword('first');
    var k_for = Keyword('for');
    var k_from = Keyword('from');
    var k_full = Keyword('full');
    var k_grant = Keyword('grant');
    var k_group = Keyword('group');
    var k_groups = Keyword('groups');
    var k_help = Choice(
        Keyword('help'),
        Token('?')
    );
    var k_indexed = Keyword('indexed');
    var k_insert = Keyword('insert');
    var k_length = Keyword('length');
    var k_last = Keyword('last');
    var k_license = Keyword('license');
    var k_limit = Keyword('limit');
    var k_list = Keyword('list');
    var k_loglevel = Keyword('loglevel');
    var k_max = Keyword('max');
    var k_max_cache_expressions = Keyword('max_cache_expressions');
    var k_mean = Keyword('mean');
    var k_median = Keyword('median');
    var k_median_low = Keyword('median_low');
    var k_median_high = Keyword('median_high');
    var k_mem_usage = Keyword('mem_usage');
    var k_merge = Keyword('merge');
    var k_min = Keyword('min');
    var k_modify = Keyword('modify');
    var k_name = Keyword('name');
    var k_network = Keyword('network');
    var k_networks = Keyword('networks');
    var k_now = Keyword('now');
    var k_online = Keyword('online');
    var k_open_files = Keyword('open_files');
    var k_or = Keyword('or');
    var k_overlap = Keyword('overlap');
    var k_password = Keyword('password');
    var k_pause = Keyword('pause');
    var k_points = Choice(
        Keyword('points'),
        Token('*')
    );
    var k_pool = Keyword('pool');
    var k_pools = Keyword('pools');
    var k_port = Keyword('port');
    var k_prefix = Keyword('prefix');
    var k_python = Keyword('python');
    var k_queries_timeout = Keyword('queries_timeout');
    var k_read = Keyword('read');
    var k_reindex_progress = Keyword('reindex_progress');
    var k_revoke = Keyword('revoke');
    var k_select = Keyword('select');
    var k_series = Keyword('series');
    var k_server = Keyword('server');
    var k_servers = Keyword('servers');
    var k_set = Keyword('set');
    var k_shard = Keyword('shard');
    var k_sharding_buffering = Keyword('sharding_buffering');
    var k_sharding_duration = Keyword('sharding_duration');
    var k_sharding_max_chunk_points = Keyword('sharding_max_chunk_points');
    var k_sharding_max_open_files = Keyword('sharding_max_open_files');
    var k_shards = Keyword('shards');
    var k_show = Keyword('show');
    var k_sid = Keyword('sid');
    var k_size = Keyword('size');
    var k_start = Keyword('start');
    var k_startup_time = Keyword('startup_time');
    var k_status = Keyword('status');
    var k_suffix = Keyword('suffix');
    var k_sum = Keyword('sum');
    var k_sync_progress = Keyword('sync_progress');
    var k_task_queue = Keyword('task_queue');
    var k_timeit = Keyword('timeit');
    var k_time_precision = Keyword('time_precision');
    var k_to = Keyword('to');
    var k_tornado_server = Keyword('tornado_server');
    var k_true = Keyword('true');
    var k_type = Keyword('type');
    var k_uptime = Keyword('uptime');
    var k_user = Keyword('user');
    var k_users = Keyword('users');
    var k_using = Keyword('using');
    var k_uuid = Keyword('uuid');
    var k_version = Keyword('version');
    var k_where = Keyword('where');
    var k_who_am_i = Keyword('who_am_i');
    var k_write = Keyword('write');
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
        Sequence(
            Token('('),
            THIS,
            Token(')')
        ),
        Sequence(
            THIS,
            Tokens('// + - *'),
            THIS
        )
    );
    var string = Choice(
        r_singleq_str,
        r_doubleq_str
    );
    var time_expr = Prio(
        r_time_str,
        k_now,
        string,
        r_integer,
        Sequence(
            Token('('),
            THIS,
            Token(')')
        ),
        Sequence(
            THIS,
            Tokens('// + - *'),
            THIS
        ),
        Sequence(
            Token('-'),
            r_integer
        )
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
    var series_columns = List(series_props, Token(','), 1, undefined, false);
    var shard_props = Choice(
        k_sid,
        k_size,
        k_start,
        k_end
    );
    var shard_columns = List(shard_props, Token(','), 1, undefined, false);
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
    var server_columns = List(server_props, Token(','), 1, undefined, false);
    var group_props = Choice(
        k_cached,
        k_expression,
        k_indexed,
        k_name,
        k_series
    );
    var group_columns = List(group_props, Token(','), 1, undefined, false);
    var user_props = Choice(
        k_user,
        k_access
    );
    var user_columns = List(user_props, Token(','), 1, undefined, false);
    var network_props = Choice(
        k_network,
        k_access,
        k_comment
    );
    var network_columns = List(network_props, Token(','), 1, undefined, false);
    var pool_props = Choice(
        k_pool,
        k_servers,
        k_series
    );
    var pool_columns = List(pool_props, Token(','), 1, undefined, false);
    var where_operator = Choice(
        Tokens('== != <= >= < >'),
        Keyword('in'),
        Sequence(
            Keyword('not'),
            Keyword('in')
        )
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
        string,
        int_expr,
        time_expr,
        k_false,
        k_true,
        where_props
    );
    var where_condition = Sequence(
        where_opts,
        where_operator,
        where_opts
    );
    var where_expr = Prio(
        where_condition,
        Sequence(
            Token('('),
            THIS,
            Token(')')
        ),
        Sequence(
            THIS,
            k_and,
            THIS
        ),
        Sequence(
            THIS,
            k_or,
            THIS
        )
    );
    var where_stmt = Sequence(
        k_where,
        where_expr
    );
    var series_name = Repeat(string, 1, 1);
    var group_name = Repeat(r_grave_str, 1, 1);
    var _boolean = Choice(
        k_true,
        k_false
    );
    var series_re = Repeat(r_regex, 1, 1);
    var uuid = Choice(
        r_uuid_str,
        string
    );
    var group_match = Sequence(
        group_name,
        Optional(series_re)
    );
    var series_match = List(Choice(
        series_name,
        series_re,
        group_match
    ), Token(','), 1, undefined, false);
    var limit_expr = Sequence(
        k_limit,
        int_expr
    );
    var before_expr = Sequence(
        k_before,
        time_expr
    );
    var after_expr = Sequence(
        k_after,
        time_expr
    );
    var between_expr = Sequence(
        k_between,
        time_expr,
        k_and,
        time_expr
    );
    var access_expr = List(access_keywords, Token(','), 1, undefined, false);
    var prefix_expr = Sequence(
        k_prefix,
        string
    );
    var suffix_expr = Sequence(
        k_suffix,
        string
    );
    var mean_expr = Sequence(
        k_mean,
        Token('('),
        time_expr,
        Token(')'),
        Optional(prefix_expr),
        Optional(suffix_expr)
    );
    var median_expr = Sequence(
        k_median,
        Token('('),
        time_expr,
        Token(')'),
        Optional(prefix_expr),
        Optional(suffix_expr)
    );
    var median_low_expr = Sequence(
        k_median_low,
        Token('('),
        time_expr,
        Token(')'),
        Optional(prefix_expr),
        Optional(suffix_expr)
    );
    var median_high_expr = Sequence(
        k_median_high,
        Token('('),
        time_expr,
        Token(')'),
        Optional(prefix_expr),
        Optional(suffix_expr)
    );
    var sum_expr = Sequence(
        k_sum,
        Token('('),
        time_expr,
        Token(')'),
        Optional(prefix_expr),
        Optional(suffix_expr)
    );
    var min_expr = Sequence(
        k_min,
        Token('('),
        time_expr,
        Token(')'),
        Optional(prefix_expr),
        Optional(suffix_expr)
    );
    var max_expr = Sequence(
        k_max,
        Token('('),
        time_expr,
        Token(')'),
        Optional(prefix_expr),
        Optional(suffix_expr)
    );
    var count_expr = Sequence(
        k_count,
        Token('('),
        time_expr,
        Token(')'),
        Optional(prefix_expr),
        Optional(suffix_expr)
    );
    var points_expr = Sequence(
        k_points,
        Optional(prefix_expr),
        Optional(suffix_expr)
    );
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
    var aggregate_expression = List(aggregate_expressions, Token(','), 1, undefined, false);
    var merge_expr = Sequence(
        k_merge,
        k_as,
        string,
        Optional(Sequence(
            k_using,
            Choice(
                k_mean,
                k_median,
                k_median_low,
                k_median_high,
                k_sum,
                k_min,
                k_max,
                k_count
            ),
            Token('('),
            time_expr,
            Token(')')
        ))
    );
    var set_comment_expr = Sequence(
        k_set,
        k_comment,
        string
    );
    var set_password_expr = Sequence(
        k_set,
        k_password,
        string
    );
    var set_indexed_expr = Sequence(
        k_set,
        k_indexed,
        _boolean
    );
    var set_address_expr = Sequence(
        k_set,
        k_address,
        string
    );
    var set_port_expr = Sequence(
        k_set,
        k_port,
        r_integer
    );
    var set_license_expr = Sequence(
        k_set,
        k_license,
        string
    );
    var set_debug_expr = Sequence(
        k_set,
        k_debug,
        _boolean
    );
    var set_loglevel_expr = Sequence(
        k_set,
        k_loglevel,
        string
    );
    var set_series_name_expr = Sequence(
        k_set,
        k_name,
        string
    );
    var alter_user_stmt = Sequence(
        k_user,
        string,
        set_password_expr
    );
    var alter_network_stmt = Sequence(
        k_network,
        string,
        set_comment_expr
    );
    var alter_group_stmt = Sequence(
        k_group,
        group_name,
        set_indexed_expr
    );
    var alter_server_stmt = Sequence(
        k_server,
        uuid,
        Choice(
            set_address_expr,
            set_port_expr,
            set_debug_expr,
            set_loglevel_expr
        )
    );
    var alter_database_stmt = Sequence(
        k_database,
        set_license_expr
    );
    var alter_series_stmt = Sequence(
        k_series,
        series_name,
        set_series_name_expr
    );
    var count_groups_stmt = Repeat(k_groups, 1, 1);
    var count_networks_stmt = Repeat(k_networks, 1, 1);
    var count_pools_stmt = Repeat(k_pools, 1, 1);
    var count_series_stmt = Sequence(
        k_series,
        Optional(series_match)
    );
    var count_servers_stmt = Repeat(k_servers, 1, 1);
    var count_shards_stmt = Repeat(k_shards, 1, 1);
    var count_users_stmt = Repeat(k_users, 1, 1);
    var create_group_stmt = Sequence(
        k_group,
        group_name,
        k_for,
        r_regex,
        Optional(set_indexed_expr)
    );
    var create_user_stmt = Sequence(
        k_user,
        string,
        set_password_expr
    );
    var create_network_stmt = Sequence(
        k_network,
        string,
        Optional(set_comment_expr)
    );
    var drop_group_stmt = Sequence(
        k_group,
        group_name
    );
    var drop_series_stmt = Sequence(
        k_series,
        Choice(
            series_match,
            where_stmt,
            Sequence(
                series_match,
                where_stmt
            )
        )
    );
    var drop_shard_stmt = Sequence(
        k_shard,
        r_integer
    );
    var drop_server_stmt = Sequence(
        k_server,
        uuid
    );
    var drop_user_stmt = Sequence(
        k_user,
        string
    );
    var drop_network_stmt = Sequence(
        k_network,
        string
    );
    var grant_user_stmt = Sequence(
        k_user,
        string,
        Optional(set_password_expr)
    );
    var grant_network_stmt = Sequence(
        k_network,
        string,
        Optional(set_comment_expr)
    );
    var list_groups_stmt = Sequence(
        k_groups,
        Optional(group_columns)
    );
    var list_networks_stmt = Sequence(
        k_networks,
        Optional(network_columns)
    );
    var list_pools_stmt = Sequence(
        k_pools,
        Optional(pool_columns)
    );
    var list_series_stmt = Sequence(
        k_series,
        Optional(series_columns),
        Optional(series_match)
    );
    var list_servers_stmt = Sequence(
        k_servers,
        Optional(server_columns)
    );
    var list_shards_stmt = Sequence(
        k_shards,
        Optional(shard_columns)
    );
    var list_users_stmt = Sequence(
        k_users,
        Optional(user_columns)
    );
    var revoke_user_stmt = Sequence(
        k_user,
        string
    );
    var revoke_network_stmt = Sequence(
        k_network,
        string
    );
    var alter_stmt = Sequence(
        k_alter,
        Choice(
            alter_user_stmt,
            alter_network_stmt,
            alter_group_stmt,
            alter_server_stmt,
            alter_database_stmt,
            alter_series_stmt
        )
    );
    var calc_stmt = Repeat(time_expr, 1, 1);
    var continue_stmt = Sequence(
        k_continue,
        uuid
    );
    var count_stmt = Sequence(
        k_count,
        Choice(
            count_groups_stmt,
            count_networks_stmt,
            count_pools_stmt,
            count_series_stmt,
            count_servers_stmt,
            count_shards_stmt,
            count_users_stmt
        ),
        Optional(where_stmt)
    );
    var create_stmt = Sequence(
        k_create,
        Choice(
            create_group_stmt,
            create_user_stmt,
            create_network_stmt
        )
    );
    var drop_stmt = Sequence(
        k_drop,
        Choice(
            drop_group_stmt,
            drop_series_stmt,
            drop_shard_stmt,
            drop_server_stmt,
            drop_user_stmt,
            drop_network_stmt
        )
    );
    var grant_stmt = Sequence(
        k_grant,
        access_expr,
        k_to,
        Choice(
            grant_user_stmt,
            grant_network_stmt
        )
    );
    var list_stmt = Sequence(
        k_list,
        Choice(
            list_series_stmt,
            list_users_stmt,
            list_networks_stmt,
            list_shards_stmt,
            list_groups_stmt,
            list_servers_stmt,
            list_pools_stmt
        ),
        Optional(where_stmt),
        Optional(limit_expr)
    );
    var pause_stmt = Sequence(
        k_pause,
        uuid
    );
    var revoke_stmt = Sequence(
        k_revoke,
        access_expr,
        k_from,
        Choice(
            revoke_user_stmt,
            revoke_network_stmt
        )
    );
    var select_stmt = Sequence(
        k_select,
        aggregate_expression,
        k_from,
        series_match,
        Optional(where_stmt),
        Optional(merge_expr),
        Optional(Choice(
            before_expr,
            after_expr,
            between_expr
        ))
    );
    var show_stmt = Sequence(
        k_show,
        Optional(Choice(
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
        ))
    );
    var timeit_stmt = Repeat(k_timeit, 1, 1);
    var help_create = Repeat(k_create, 1, 1);
    var help_continue = Repeat(k_continue, 1, 1);
    var help_drop = Repeat(k_drop, 1, 1);
    var help_select = Repeat(k_select, 1, 1);
    var help_timeit = Repeat(k_timeit, 1, 1);
    var help_list_pools = Repeat(k_pools, 1, 1);
    var help_list_series = Repeat(k_series, 1, 1);
    var help_list_servers = Repeat(k_servers, 1, 1);
    var help_list_networks = Repeat(k_networks, 1, 1);
    var help_list_users = Repeat(k_users, 1, 1);
    var help_list = Sequence(
        k_list,
        Optional(Choice(
            help_list_pools,
            help_list_series,
            help_list_servers,
            help_list_networks,
            help_list_users
        ))
    );
    var help_pause = Repeat(k_pause, 1, 1);
    var help_alter_database = Repeat(k_database, 1, 1);
    var help_alter = Sequence(
        k_alter,
        Optional(Choice(
            help_alter_database
        ))
    );
    var help_count = Repeat(k_count, 1, 1);
    var help_show = Repeat(k_show, 1, 1);
    var help = Sequence(
        k_help,
        Optional(Choice(
            help_create,
            help_continue,
            help_drop,
            help_select,
            help_timeit,
            help_list,
            help_pause,
            help_alter,
            help_count,
            help_show
        ))
    );
    var START = Sequence(
        Optional(timeit_stmt),
        Choice(
            select_stmt,
            list_stmt,
            count_stmt,
            alter_stmt,
            continue_stmt,
            create_stmt,
            drop_stmt,
            grant_stmt,
            pause_stmt,
            revoke_stmt,
            show_stmt,
            calc_stmt,
            help
        ),
        Optional(r_comment)
    );

    window.SiriGrammar = Grammar(START, '[a-z_]+');

})(
    window.jsleri.Choice,
    window.jsleri.Token,
    window.jsleri.Rule,
    window.jsleri.Optional,
    window.jsleri.Prio,
    window.jsleri.Tokens,
    window.jsleri.Keyword,
    window.jsleri.THIS,
    window.jsleri.Regex,
    window.jsleri.Repeat,
    window.jsleri.Sequence,
    window.jsleri.List,
    window.jsleri.Grammar
);

