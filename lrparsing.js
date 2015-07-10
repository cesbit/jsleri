'use strict';

(function () {

    var lrparsing = {};

    var RE_LEFT_WHITESPACE = /^\s+/;
    var RE_DEFAULT_IDENT = /^\w+/;

    var buildIdent = function (re) {
        return new RegExp('^' + re);
    };

    var NodeResult = function (isValid, pos) {
        this.isValid = isValid;
        this.pos = pos;
        this.expecting = null;
    };

    var Node = function (obj, start, end, str) {
        this.obj = obj;
        this.start = start;
        this.end = end;
        this.str = str;
        this.childs = [];
    };

    var parse = function (obj, str, tree, ident) {
        var expecting = [];

        var walk = function (obj, pos, tree, rule) {

            var s = str.substring(pos);
            var isValid, nodeRes, i, l, reMatch;

            s = s.replace(RE_LEFT_WHITESPACE, '');

            var node = new Node(obj, str.length - s.length);

            if (obj instanceof Optional) {
                nodeRes = walk(obj.optional, node.start, node.childs, rule);
                if (nodeRes.isValid) {
                    node.end = nodeRes.pos;
                    node.str = str.substring(node.start, node.end);
                    tree.push(node);
                }
                return new NodeResult(true, nodeRes.pos);
            }

            if (obj instanceof Sequence) {
                pos = node.start;
                for (i = 0, l = obj.sequence.length; i < l; i++) {
                    nodeRes = walk(obj.sequence[i], pos, node.childs, rule);
                    if (nodeRes.isValid)
                        pos = nodeRes.pos;
                    else
                        return nodeRes;
                }
                node.end = nodeRes.pos;
                node.str = str.substring(node.start, node.end);
                tree.push(node);
                return nodeRes;
            }

            if (obj instanceof Keyword) {
                reMatch = s.match(ident);
                isValid = Boolean( reMatch && reMatch[0] === obj.keyword );
                if (!isValid)
                    expecting.push(obj);
                else {
                    expecting.length = 0;
                    node.end = node.start + obj.keyword.length;
                    node.str = str.substring(node.start, node.end);
                    tree.push(node);
                }
                return new NodeResult(isValid, node.end || node.start);
            }

            if (obj instanceof Regex) {
                reMatch = s.match(obj._re);
                isValid = Boolean(reMatch);

                if (!isValid)
                    expecting.push(obj);
                else {
                    expecting.length = 0;
                    node.end = node.start + reMatch[0].length;
                    node.str = str.substring(node.start, node.end);
                    tree.push(node);
                }
                return new NodeResult(isValid, node.end || node.start);
            }

            if (obj instanceof This) {
                if (rule.tested[node.start] === undefined) {
                    rule.tested[node.start] = new NodeResult(false, node.start);
                    rule.tested[node.start] = walk(rule.obj, node.start, node.childs, rule);
                }
                if (rule.tested[node.start].isValid) {
                    node.end = rule.tested[node.start].pos;
                    node.str = str.substring(node.start, node.end);
                    tree.push(node);
                }
                return rule.tested[node.start];
            }

            if (obj instanceof Prio) {
                if (rule.tested[node.start] === undefined) {
                    rule.tested[node.start] = new NodeResult(false, node.start);
                }
                for (i = 0, l = obj.prio.length; i < l; i++) {
                    var childeren = [];
                    nodeRes = walk(obj.prio[i], node.start, childeren, rule);

                    if (nodeRes.isValid && nodeRes.pos > rule.tested[node.start].pos) {
                        node.childs = childeren;
                        rule.tested[node.start] = nodeRes;
                    }
                }
                if (rule.tested[node.start].isValid) {
                    expecting.length = 0;
                    node.end = rule.tested[node.start].pos;
                    node.str = str.substring(node.start, node.end);
                    tree.push(node);
                }
                return rule.tested[node.start];
            }

            if (obj instanceof Rule) {
                obj.tested = {};
                nodeRes = walk(obj.obj, node.start, node.childs, obj);
                if (nodeRes.isValid) {
                    node.end = nodeRes.pos;
                    node.str = str.substring(node.start, node.end);
                    tree.push(node);
                }
                return nodeRes;
            }
        };

        var nodeResult = walk(obj, 0, tree, obj);
        nodeResult.expecting = expecting;
        return nodeResult;
    };

    // var defaults = function (obj, defs) {
    //     for (var i in defs) {
    //       if (defs.hasOwnProperty(i) && !obj.hasOwnProperty(i)) {
    //          obj[i] = defs[i];
    //       }
    //    }
    // };

    var Keyword = function (keyword, ignCase) {
        if (!(this instanceof Keyword))
            return new Keyword(keyword, ignCase);

        ignCase = Boolean(ignCase);

        this.keyword = keyword;
        this.ignCase = ignCase;
    };

    var Regex = function (re, ignCase) {
        if (!(this instanceof Regex))
            return new Regex(re);

        ignCase = Boolean(ignCase);
        this.re = re;
        this._re = new RegExp('^' + re, ignCase ? 'i' : undefined);
    };

    var Root = function (obj, ident) {
        if (!(this instanceof Root))
            return new Root(obj, ident);

        if (ident === undefined) ident = RE_DEFAULT_IDENT;

        this.parse = function (str) {
            var tree = new Node(this, 0, str.length, str);
            var nodeRes = parse(
                obj,
                str,
                tree.childs,
                (ident === undefined) ? RE_DEFAULT_IDENT : buildIdent(ident)
            );
            if (nodeRes.isValid) {
                var s = str.substring(nodeRes.pos);
                s = s.replace(RE_LEFT_WHITESPACE, '');
                if (s) {
                    nodeRes.isValid = false;
                    nodeRes.pos = str.length - s.length;
                }
            }
            nodeRes.tree = tree;
            return nodeRes;
        };
    };

    var Sequence = function (sequence) {
        if (!(sequence instanceof Array))
            sequence = Array.prototype.slice.call(arguments);

        if (!(this instanceof Sequence))
            return new Sequence(sequence);

        this.sequence = sequence;
    };

    var Optional = function (optional) {
        if (!(this instanceof Optional))
            return new Optional(optional);

        this.optional = optional;
    };

    var Prio = function (prio) {
        if (!(prio instanceof Array))
            prio = Array.prototype.slice.call(arguments);

        if (!(this instanceof Prio))
            return new Prio(prio);

        this.prio = prio;
        return (new Rule(this));
    };

    var This = function () {
        if (!(this instanceof This))
            return new This();
    };

    var Ref = function () {
        if (!(this instanceof Ref))
            return new Ref();

        this.pos = null;
    };

    var THIS = new This();

    var Rule = function (obj) {
        if (!(this instanceof Rule))
            return new Rule(obj);

        this.obj = obj;
    };

    lrparsing.Keyword = Keyword;
    lrparsing.Root = Root;
    lrparsing.Regex = Regex;
    lrparsing.Sequence = Sequence;
    lrparsing.Optional = Optional;
    lrparsing.Prio = Prio;
    lrparsing.THIS = THIS;

    window.lrparsing = lrparsing;


})();


// lrparsing.predict(s) --> []
