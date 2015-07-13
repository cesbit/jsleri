'use strict';

(function () {

    var lrparsing = {};

    var Lrparsing = function () {};

    var RE_LEFT_WHITESPACE = /^\s+/;
    var RE_DEFAULT_IDENT = /^\w+/;
    var RE_WHITESPACE = /\s+/;

    var EndOfStatement = function (pos) {
        this.e = 'Expecting end of statement at pos ' + pos;
    };

    var buildIdent = function (re) {
        return new RegExp('^' + re);
    };

    var sortOnStrLen = function (a, b) {
        return a.length < b.length;
    };

    var checkElements = function (a) {
        for (var i = 0, l = a.length; i < l; i++)
            if (!(a[i] instanceof Lrparsing)) {
                a[i] = new Token(a[i]);
            }
        return a;
    };

    var NodeResult = function (isValid, pos) {
        this.isValid = isValid;
        this.pos = pos;
        this.expecting = null;
    };

    var Node = function (element, start, end, str) {
        this.element = element;
        this.start = start;
        this.end = end;
        this.str = str;
        this.childs = [];
    };

    var parse = function (element, str, tree, ident) {
        var expecting = [],
            expectingPos = 0;

        var updateExpecting = function (element, pos) {
            if (pos > expectingPos) {
                expecting.length = 0;
                expectingPos = pos;
            }
            if (pos === expectingPos)
                expecting.push(element);
        };

        var appendTree = function (tree, node, pos) {
            node.end = pos;
            node.str = str.substring(node.start, node.end);
            tree.push(node);
        };

        var walk = function (element, pos, tree, rule) {

            var s,
                isValid,
                nodeRes,
                i,
                l,
                reMatch,
                children,
                node,
                mostGreedy;

            s = str.substring(pos).replace(RE_LEFT_WHITESPACE, '');

            node = new Node(element, str.length - s.length);

            /**************************************************************************
             * Optional
             **************************************************************************/
            if (element instanceof Optional) {
                nodeRes = walk(element.element, node.start, node.childs, rule);
                if (nodeRes.isValid)
                    appendTree(tree, node, nodeRes.pos);
                return new NodeResult(true, node.end || node.start);
            }

            /**************************************************************************
             * Sequence
             **************************************************************************/
            if (element instanceof Sequence) {
                pos = node.start;
                for (i = 0, l = element.elements.length; i < l; i++) {
                    nodeRes = walk(element.elements[i], pos, node.childs, rule);
                    if (nodeRes.isValid)
                        pos = nodeRes.pos;
                    else
                        return nodeRes;
                }
                appendTree(tree, node, nodeRes.pos);
                return nodeRes;
            }

            /**************************************************************************
             * Keyword
             **************************************************************************/
            if (element instanceof Keyword) {
                reMatch = s.match(ident);
                isValid = Boolean( reMatch && reMatch[0] === element.keyword );
                if (isValid)
                    appendTree(tree, node, node.start + element.keyword.length);
                else
                    updateExpecting(element, node.start);
                return new NodeResult(isValid, node.end || node.start);
            }

            /**************************************************************************
             * Tokens
             **************************************************************************/
            if (element instanceof Tokens) {
                for (i = 0, l = element.tokens.length; i < l; i++) {
                    if (s.indexOf(element.tokens[i]) === 0) {
                        appendTree(tree, node, node.start + element.tokens[i].length);
                        return new NodeResult(true, node.end);
                    }
                }
                updateExpecting(element, node.start);
                return new NodeResult(false, node.start);
            }

            /**************************************************************************
             * Token
             **************************************************************************/
            if (element instanceof Token) {
                isValid = Boolean(s.indexOf(element.token) === 0);

                if (isValid)
                    appendTree(tree, node, node.start + element.token.length);
                else
                    updateExpecting(element, node.start);
                return new NodeResult(isValid, node.end || node.start);
            }

            /**************************************************************************
             * Regex
             **************************************************************************/
            if (element instanceof Regex) {
                reMatch = s.match(element._re);
                isValid = Boolean(reMatch);

                if (isValid)
                    appendTree(tree, node, node.start + reMatch[0].length);
                else
                    updateExpecting(element, node.start);
                return new NodeResult(isValid, node.end || node.start);
            }

            /**************************************************************************
             * This
             **************************************************************************/
            if (element instanceof This) {
                if (rule._tested[node.start] === undefined)
                    rule._tested[node.start] = walk(rule.element, node.start, node.childs, rule);
                if (rule._tested[node.start].isValid)
                    appendTree(tree, node, rule._tested[node.start].pos);
                return rule._tested[node.start];
            }

            /**************************************************************************
             * List
             **************************************************************************/
            if (element instanceof List) {
                pos = node.start;
                for (i = 0, l = 0;;) {
                    nodeRes = walk(element.element, pos, node.childs, rule);
                    if (!nodeRes.isValid)
                        break;
                    pos = nodeRes.pos;
                    i++;

                    nodeRes = walk(element.delimiter, pos, node.childs, rule);
                    if (!nodeRes.isValid)
                        break;
                    pos = nodeRes.pos;
                    l++;
                }
                isValid = (!(i < element.min || (element.max && i > element.max) || (!element.opt && i && i == l)));
                if (isValid)
                    appendTree(tree, node, pos);
                return new NodeResult(isValid, pos);
            }

            /**************************************************************************
             * Choice
             **************************************************************************/
            if (element instanceof Choice) {
                mostGreedy = new NodeResult(false, node.start);

                for (i = 0, l = element.elements.length; i < l; i++) {
                    children = [];
                    nodeRes = walk(element.elements[i], node.start, children, rule);

                    if (nodeRes.isValid && nodeRes.pos > mostGreedy.pos) {
                        node.childs = children;
                        mostGreedy = nodeRes;
                    }
                }
                if (mostGreedy.isValid)
                    appendTree(tree, node, mostGreedy.pos);
                return mostGreedy;
            }

            /**************************************************************************
             * Prio
             **************************************************************************/
            if (element instanceof Prio) {
                if (rule._tested[node.start] === undefined) {
                    rule._tested[node.start] = new NodeResult(false, node.start);
                }
                for (i = 0, l = element.elements.length; i < l; i++) {
                    children = [];
                    nodeRes = walk(element.elements[i], node.start, children, rule);

                    if (nodeRes.isValid && nodeRes.pos > rule._tested[node.start].pos) {
                        node.childs = children;
                        rule._tested[node.start] = nodeRes;
                    }
                }
                if (rule._tested[node.start].isValid)
                    appendTree(tree, node, rule._tested[node.start].pos);
                return rule._tested[node.start];
            }

            /**************************************************************************
             * Rule
             **************************************************************************/
            if (element instanceof Rule) {
                element._tested = {};
                nodeRes = walk(element.element, node.start, node.childs, element);
                if (nodeRes.isValid)
                    appendTree(tree, node, nodeRes.pos);
                return nodeRes;
            }

        };

        // start walking the tree
        var nodeRes = walk(element, 0, tree, element);

        // get rest if anything
        var rest = str.substring(nodeRes.pos).replace(RE_LEFT_WHITESPACE, '');

        if (nodeRes.isValid && rest) nodeRes.isValid = false;

        if (!nodeRes.isValid && !expecting.length) {
            expecting.push(new EndOfStatement(nodeRes.pos));
            expectingPos = str.length - rest.length;
        }
        if (!nodeRes.isValid) {
            nodeRes.expecting = expecting;
            nodeRes.pos = expectingPos;
        }
        // return nodeRes
        return nodeRes;
    };

    /**************************************************************************
     * Keyword constructor
     **************************************************************************/
    var Keyword = function (keyword, ignCase) {
        if (!(this instanceof Keyword))
            return new Keyword(keyword, ignCase);

        ignCase = Boolean(ignCase);

        this.keyword = keyword;
        this.ignCase = ignCase;
    };
    Keyword.prototype = Object.create(Lrparsing.prototype);
    Keyword.prototype.constructor = Keyword;
    lrparsing.Keyword = Keyword;

    /**************************************************************************
     * Regex constructor
     **************************************************************************/
    var Regex = function (re, ignCase) {
        if (!(this instanceof Regex))
            return new Regex(re);

        ignCase = Boolean(ignCase);
        this.re = re;
        this._re = new RegExp('^' + re, ignCase ? 'i' : undefined);
    };
    Regex.prototype = Object.create(Lrparsing.prototype);
    Regex.prototype.constructor = Regex;
    lrparsing.Regex = Regex;

    /**************************************************************************
     * Root constructor
     **************************************************************************/
    var Root = function (element, ident) {
        if (!(this instanceof Root))
            return new Root(element, ident);

        if (!(element instanceof Lrparsing))
            throw '(Lrparsing.Optional) first argument must be an instance of Lrparsing; got ' + typeof element;

        this.ident = (ident === undefined) ? RE_DEFAULT_IDENT : buildIdent(ident);
        this.element = element;

        this.parse = function (str) {
            var tree = new Node(this, 0, str.length, str);
            var nodeRes = parse(
                element,
                str,
                tree.childs,
                this.ident
            );

            nodeRes.tree = tree;
            return nodeRes;
        };
    };
    Root.prototype = Object.create(Lrparsing.prototype);
    Root.prototype.constructor = Root;
    lrparsing.Root = Root;

    /**************************************************************************
     * Sequence constructor
     **************************************************************************/
    var Sequence = function (elements) {
        if (!(elements instanceof Array))
            elements = Array.prototype.slice.call(arguments);

        if (!(this instanceof Sequence))
            return new Sequence(elements);

        this.elements = checkElements(elements);
    };
    Sequence.prototype = Object.create(Lrparsing.prototype);
    Sequence.prototype.constructor = Sequence;
    lrparsing.Sequence = Sequence;

    /**************************************************************************
     * Choice constructor
     **************************************************************************/
    var Choice = function (elements) {
        if (!(elements instanceof Array))
            elements = Array.prototype.slice.call(arguments);

        if (!(this instanceof Choice))
            return new Choice(elements);

        for (var i = 0, l = elements.length; i < l; i++)
            if (!(elements[i] instanceof Lrparsing))
                throw '(Lrparsing.Choice) arguments must be a instances of Lrparsing; got ' + typeof elements[i];

        this.elements = elements;
    };
    Choice.prototype = Object.create(Lrparsing.prototype);
    Choice.prototype.constructor = Choice;
    lrparsing.Choice = Choice;

    /**************************************************************************
     * Optional constructor
     **************************************************************************/
    var Optional = function (element) {
        if (!(this instanceof Optional))
            return new Optional(element);

        if (!(element instanceof Lrparsing))
            throw '(Lrparsing.Optional) first argument must be an instance of Lrparsing; got ' + typeof element;

        this.element = element;
    };
    Optional.prototype = Object.create(Lrparsing.prototype);
    Optional.prototype.constructor = Optional;
    lrparsing.Optional = Optional;

    /**************************************************************************
     * Prio constructor
     **************************************************************************/
    var Prio = function (elements) {
        if (!(elements instanceof Array))
            elements = Array.prototype.slice.call(arguments);

        if (!(this instanceof Prio))
            return new Prio(elements);

        for (var i = 0, l = elements.length; i < l; i++)
            if (!(elements[i] instanceof Lrparsing))
                throw '(Lrparsing.Prio) arguments must be a instances of Lrparsing; got ' + typeof elements[i];

        this.elements = elements;
        return (new Rule(this));
    };
    Prio.prototype = Object.create(Lrparsing.prototype);
    Prio.prototype.constructor = Prio;
    lrparsing.Prio = Prio;

    /**************************************************************************
     * This constructor --> THIS
     **************************************************************************/
    var This = function () {
        if (!(this instanceof This))
            return new This();
    };
    This.prototype = Object.create(Lrparsing.prototype);
    This.prototype.constructor = This;
    var THIS = new This();
    lrparsing.THIS = THIS;

    /**************************************************************************
     * Rule constructor
     **************************************************************************/
    var Rule = function (element) {
        if (!(this instanceof Rule))
            return new Rule(element);

        if (!(element instanceof Lrparsing))
            throw '(Lrparsing.Rule) first argument must be an instance of Lrparsing; got ' + typeof element;

        this.element = element;
    };
    Rule.prototype = Object.create(Lrparsing.prototype);
    Rule.prototype.constructor = Rule;

    /**************************************************************************
     * Tokens constructor
     **************************************************************************/
    var Tokens = function (tokens) {
        if (!(this instanceof Tokens))
            return new Tokens(tokens);

        if (typeof tokens !== 'string')
            throw '(Lrparsing.Tokens) first argument must be a string; got ' + typeof tokens;

        this.tokens = tokens.split(RE_WHITESPACE).sort(sortOnStrLen);
    };
    Tokens.prototype = Object.create(Lrparsing.prototype);
    Tokens.prototype.constructor = Tokens;
    lrparsing.Tokens = Tokens;

    /**************************************************************************
     * Token constructor
     **************************************************************************/
    var Token = function (token) {
        if (!(this instanceof Token))
            return new Token(token);

        if (typeof token !== 'string')
            throw '(Lrparsing.Token) first argument must be a string; got ' + typeof token;

        this.token = token;
    };
    Token.prototype = Object.create(Lrparsing.prototype);
    Token.prototype.constructor = Token;
    lrparsing.Token = Token;

    /**************************************************************************
     * List constructor
     **************************************************************************/
    var List = function (element, delimiter, _min, _max, opt) {
        if (!(this instanceof List))
            return new List(element, delimiter, _min, _max, opt);

        if (!(element instanceof Lrparsing))
            throw '(Lrparsing.List) first argument must be an instance of Lrparsing; got ' + typeof element;

        if (typeof delimiter !== 'string')
            throw '(Lrparsing.List) second argument must be a string; got ' + typeof delimiter;

        this.element = element;
        this.delimiter = new Token(delimiter);
        this.min = (_min === undefined || _min === null) ? 0 : _min;
        this.max = (_max === undefined || _max === null) ? null : _max;

        // when true the list may end with a delimiter
        this.opt = Boolean (opt);
    };
    List.prototype = Object.create(Lrparsing.prototype);
    List.prototype.constructor = List;
    lrparsing.List = List;


    // export lrparsing
    window.lrparsing = lrparsing;
})();
