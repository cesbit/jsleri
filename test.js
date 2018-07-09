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
        // assert.equal(version, '1.1.3');
    });

});

describe('Test Keyword', () => {

    it('should parse a Keyword Element as expected', () => {
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

});

describe('Test Keyword Ignore Case', () => {

    it('should parse a Keyword (ignCase) Element as expected', () => {
        let hi = Keyword('hi', true);
        let grammar = Grammar(hi);

        // assert statements
        assert.equal(true, hi.ignCase);
        assert.equal(true, grammar.parse('hi').isValid);
        assert.equal(true, grammar.parse('Hi').isValid);
        assert.equal(false, grammar.parse('').isValid);
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