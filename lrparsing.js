'use strict';

(function () {

    var lrparsing = {};

    var RE_LEFT_WHITESPACE = /^\s+/;

    var NodeResult = function (isValid, pos, expecting) {
        this.isValid = isValid;
        this.pos = pos;
        this.expecting = expecting;
    };

    var Node = function (obj, start, end, str) {
        this.obj = obj;
        this.start = start;
        this.end = end;
        this.str = str;
        this.childs = [];
    };

    var parse = function (obj, str, pos, tree, expecting) {
        var s = str.substring(pos);
        var isValid, nodeRes, i, l, reMatch;

        s = s.replace(RE_LEFT_WHITESPACE, '');

        var node = new Node(obj, str.length - s.length);

        if (obj instanceof lrparsing.Optional) {
            nodeRes = parse(obj.optional, str, node.start, node.childs, expecting);
            if (nodeRes.isValid) {
                node.end = nodeRes.pos;
                node.str = str.substring(node.start, node.end);
                tree.push(node);
            }
            return new NodeResult(true, nodeRes.pos, nodeRes.expecting);
        }

        if (obj instanceof lrparsing.Sequence) {
            pos = node.start;
            for (i = 0, l = obj.sequence.length; i < l; i++) {
                nodeRes = parse(obj.sequence[i], str, pos, node.childs, expecting);
                if (nodeRes.isValid) {
                    pos = nodeRes.pos;
                } else return nodeRes;
            }
            node.end = nodeRes.pos;
            node.str = str.substring(node.start, node.end);
            tree.push(node);
            return nodeRes;
        }

        if (obj instanceof lrparsing.Keyword) {
            isValid = obj._re.test(s);
            if (!isValid)
                expecting.push(obj);
            else {
                expecting.length = 0;
                node.end = node.start + obj.keyword.length;
                node.str = str.substring(node.start, node.end);
                tree.push(node);
            }
            return new NodeResult(isValid, node.end || node.start, expecting);
        }

        if (obj instanceof lrparsing.Regex) {
            reMatch = s.match(obj._re);
            isValid = Boolean(reMatch);

            if (!isValid)
                expecting.push(obj);
            else {
                reStr = reStr[1];
                expecting.length = 0;
                node.end = node.start + reMatch[1].length;
                node.str = str.substring(node.start, node.end);
                tree.push(node);
            }
            return new NodeResult(isValid, node.end || node.start, expecting);
        }
    };

    // var defaults = function (obj, defs) {
    //     for (var i in defs) {
    //       if (defs.hasOwnProperty(i) && !obj.hasOwnProperty(i)) {
    //          obj[i] = defs[i];
    //       }
    //    }
    // };

    lrparsing.Keyword = function (keyword, ignCase) {
        if (!(this instanceof lrparsing.Keyword))
            return new lrparsing.Keyword(keyword, ignCase);

        ignCase = Boolean(ignCase);

        this.keyword = keyword;
        this.ignCase = ignCase;
        this._re = new RegExp('^' + keyword + '\\b', ignCase ? 'i' : undefined);
    };

    lrparsing.Regex = function (re, ignCase) {
        if (!(this instanceof lrparsing.Regex))
            return new lrparsing.Regex(re);

        ignCase = Boolean(ignCase);
        this.re = re;
        this._re = new RegExp('^(' + re + ')(\\s|$)', ignCase ? 'i' : undefined);

    };

    lrparsing.Root = function (obj) {
        if (!(this instanceof lrparsing.Root))
            return new lrparsing.Root(obj);

        this.parse = function (str) {
            var tree = new Node(this, 0, str.length, str);
            var nodeRes = parse(obj, str, 0, tree.childs, []);
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

    lrparsing.Sequence = function (sequence) {
        if (!(sequence instanceof Array))
            sequence = Array.prototype.slice.call(arguments);

        if (!(this instanceof lrparsing.Sequence))
            return new lrparsing.Sequence(sequence);

        this.sequence = sequence;
    };

    var Optional = function (optional) {
        if (!(this instanceof Optional))
            return new Optional(optional);

        this.optional = optional;
    };

    var Rule = function (rule) {
        if (!(this instanceof Rule))
            return new Rule(rule);

        this.rule = rule;
    };

    lrparsing.Optional = Optional;
    lrparsing.Rule = Rule;

    window.lrparsing = lrparsing;


})();


// lrparsing.predict(s) --> []
