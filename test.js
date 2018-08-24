import assert from 'assert';
import {
    version,
    noop,
    Keyword,
    Regex,
    Token,
    Tokens,
    Sequence,
    Choice,
    Repeat,
    List,
    Optional,
    Ref,
    Prio,
    THIS,
    Grammar,
    EOS
} from './jsleri';


class JsonGrammar extends Grammar {
    static START = Ref(Choice);
    static r_string = Regex('^(")(?:(?=(\\\\?))\\2.)*?\\1');
    static r_float = Regex('^-?[0-9]+\\.?[0-9]+');
    static r_integer = Regex('^-?[0-9]+');
    static k_true = Keyword('true');
    static k_false = Keyword('false');
    static k_null = Keyword('null');
    static json_map_item = Sequence(
        JsonGrammar.r_string,
        Token(':'),
        JsonGrammar.START
    );
    static json_map = Sequence(
        Token('{'),
        List(JsonGrammar.json_map_item, Token(','), 0, undefined, false),
        Token('}')
    );
    static json_array = Sequence(
        Token('['),
        List(JsonGrammar.START, Token(','), 0, undefined, false),
        Token(']')
    );
    constructor() {
        super(JsonGrammar.START, '^\\w+');
        JsonGrammar.START.set(Choice(
            JsonGrammar.r_string,
            JsonGrammar.r_float,
            JsonGrammar.r_integer,
            JsonGrammar.k_true,
            JsonGrammar.k_false,
            JsonGrammar.k_null,
            JsonGrammar.json_map,
            JsonGrammar.json_array
        ));
    }
}

describe('Test version string', () => {

    it('should return a version string', () => {
        assert.equal(typeof version, 'string');
        // Only test when using import from ./dist/jsleri
        // assert.equal(version, '1.1.4');
    });

});

describe('Test Keyword', () => {

    it('should parse `Keyword` as expected', () => {
        let hi = Keyword('hi');
        let grammar = Grammar(hi);

        // assert statements
        assert.equal(false, hi.ignCase);
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(true, grammar.parse(' hi ').isValid);
        assert.equal(false, grammar.parse('Hi').isValid);
        assert.equal(false, grammar.parse('hello').isValid);
        assert.deepEqual([], grammar.parse('hi').expecting);
        assert.deepEqual([hi], grammar.parse('').expecting);
        assert.deepEqual([EOS], grammar.parse('hi!').expecting);
    });

    it('should parse `Keyword` (ignCase) as expected', () => {
        let hi = Keyword('hi', true);
        let grammar = Grammar(hi);

        // assert statements
        assert.equal(true, hi.ignCase);
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(true, grammar.parse('Hi').isValid);
        assert.equal(false, grammar.parse('').isValid);
    });

});

describe('Test Sequence', () => {

    it('should parse `Sequence` as expected', () => {
        let hi = Keyword('hi', true);
        let iris = Keyword('iris', true);
        let seq = Sequence(hi, iris);
        let grammar = Grammar(seq);

        // assert statements
        assert.equal(true, grammar.parse('hi iris').isValid);
        assert.equal(false, grammar.parse('hi sasha').isValid);
    });

});

describe('Test Choice', () => {

    it('should parse `Choice` as expected', () => {
        let hi = Keyword('hi');
        let iris = Keyword('iris');
        let seq = Sequence(hi, iris);
        let choice = Choice(hi, seq);
        let grammar = Grammar(choice);

        // assert statements
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(true, grammar.parse('hi iris').isValid);
        assert.equal(false, grammar.parse('hi sasha').isValid);
    });

});

describe('Test Optional', () => {

    it('should parse `Optional` as expected', () => {
        let hi = Keyword('hi');
        let optional = Optional(hi);
        let grammar = Grammar(optional);

        // assert statements
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(true, grammar.parse('').isValid);
        assert.equal(false, grammar.parse('hello').isValid);
        assert.equal(0, grammar.parse('').pos);
        assert.deepEqual([hi, EOS], grammar.parse('x').expecting);
    });

});

describe('Test Token', () => {

    it('should parse `Token` with single char as expected', () => {
        let dot = Token('.');
        let grammar = Grammar(dot);

        // assert statements
        assert.equal(true, grammar.parse('.').isValid);
        assert.equal(false, grammar.parse('..').isValid);
        assert.equal(false, grammar.parse('').isValid);
    });

    it('should parse `Token` with multiple chars as expected', () => {
        let not = Token('!=');
        let grammar = Grammar(not);

        // assert statements
        assert.equal(true, grammar.parse(' != ').isValid);
        assert.equal(false, grammar.parse('!').isValid);
    });

});

describe('Test List', () => {

    it('should parse `List` with default options as expected', () => {
        let hi = Keyword('hi');
        let list = List(hi);
        let grammar = Grammar(list);

        // assert statements
        assert.equal(0, list.min);
        assert.equal(null, list.max);
        assert.equal(false, list.opt);
        assert.equal(true, grammar.parse('hi, hi, hi').isValid);
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(true, grammar.parse('').isValid);
        assert.equal(false, grammar.parse('hi,').isValid);
    });

    it('should parse `List` with alternative options as expected', () => {
        let hi = Keyword('hi');
        let list = List(hi, '-', 1, 3, true);
        let grammar = Grammar(list);

        // assert statements
        assert.equal(1, list.min);
        assert.equal(3, list.max);
        assert.equal(true, list.opt);
        assert.equal(true, grammar.parse('hi - hi - hi').isValid);
        assert.equal(true, grammar.parse('hi-hi-hi-').isValid);
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(false, grammar.parse('').isValid);
        assert.equal(false, grammar.parse('-').isValid);
        assert.equal(false, grammar.parse('hi-hi-hi-hi').isValid);
    });

});

describe('Test Repeat', () => {

    it('should parse `Repeat` with default options as expected', () => {
        let hi = Keyword('hi');
        let repeat = Repeat(hi);
        let grammar = Grammar(repeat);

        // assert statements
        assert.equal(0, repeat.min);
        assert.equal(null, repeat.max);
        assert.equal(true, grammar.parse('hi hi hi').isValid);
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(true, grammar.parse('').isValid);
        assert.equal(false, grammar.parse('hihi').isValid);
        assert.equal(false, grammar.parse('ha').isValid);
    });

    it('should parse `Repeat` with alternative options as expected', () => {
        let hi = Keyword('hi');
        let repeat = Repeat(hi, 1, 3);
        let grammar = Grammar(repeat);

        // assert statements
        assert.equal(1, repeat.min);
        assert.equal(3, repeat.max);
        assert.equal(true, grammar.parse('hi  hi  hi').isValid);
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(false, grammar.parse('').isValid);
        assert.equal(false, grammar.parse('hi hi hi hi').isValid);
    });

});

describe('Test Tokens', () => {

    it('should parse `Tokens` as expected', () => {
        let tokens = Tokens('== != >= <=   >   < ');
        let grammar = Grammar(tokens);

        // assert statements
        assert.equal(true, grammar.parse('==').isValid);
        assert.equal(true, grammar.parse('<=').isValid);
        assert.equal(true, grammar.parse('>').isValid);
        assert.equal(false, grammar.parse('').isValid);
        assert.equal(false, grammar.parse('=').isValid);
        assert.deepEqual(['==', '!=', '>=', '<=', '>', '<'], tokens.tokens);
    });

});

describe('Test Regex', () => {

    it('should parse `Regex` as expected', () => {
        let pattern = '(/[^/\\\\]*(?:\\\\.[^/\\\\]*)*/i?)';
        let regex = Regex(pattern);
        let grammar = Grammar(regex);

        // assert statements
        assert.equal(true, grammar.parse('/hi/').isValid);
        assert.equal(true, grammar.parse('/hi/i').isValid);
        assert.equal(true, grammar.parse('  //i ').isValid);
        assert.equal(false, grammar.parse('x//i ').isValid);
        assert.equal(false, grammar.parse('//x').isValid);
        assert.equal(false, grammar.parse('').isValid);
        assert.equal(false, grammar.parse('/').isValid);
        assert.equal(false, grammar.parse('///').isValid);
        assert.equal(pattern, regex.re);
    });

});

describe('Test Ref', () => {

    it('should parse `Ref` as expected', () => {
        let ref = Ref(Keyword);
        let hi = Keyword('hi');
        let grammar = Grammar(ref);
        ref.set(hi);

        // assert statements
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(false, grammar.parse('').isValid);
    });

});

describe('Test Prio', () => {

    it('should parse `Prio` as expected', () => {
        let prio = Prio(
            Keyword('hi'),
            Keyword('bye'),
            Sequence('(', THIS, ')'),
            Sequence(THIS, Keyword('or'), THIS),
            Sequence(THIS, Keyword('and'), THIS)
        );
        let grammar = Grammar(prio);

        // assert statements
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(true, grammar.parse('(bye)').isValid);
        assert.equal(true, grammar.parse('(hi and bye)').isValid);
        assert.equal(true, grammar.parse('(hi or hi) and (hi or hi)').isValid);
        assert.equal(true, grammar.parse('(hi or (hi and bye))').isValid);
        assert.equal(false, grammar.parse('').isValid);
        assert.equal(false, grammar.parse('(hi').isValid);
        assert.equal(false, grammar.parse('()').isValid);
        assert.equal(false, grammar.parse('(hi or hi) and').isValid);
    });

});

describe('Test JsonGrammar', () => {

    it('should successfully initialize JsonGrammar', () => {
        let jsonGrammar = new JsonGrammar();
        assert.equal(typeof jsonGrammar.parse, 'function');
    });

    it('should parse json', () => {
        let jsonGrammar = new JsonGrammar();
        assert.equal(true, jsonGrammar.parse('{"json": [1, 2, 3]}').isValid);
    });

    it('should parse invalid json', () => {
        let jsonGrammar = new JsonGrammar();
        assert.equal(false, jsonGrammar.parse('{"json": [1, 2, 3]').isValid);
    });

});