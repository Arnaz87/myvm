var lexer = require("./lexer.js");

function tokstate (tokens) {
  return {
    pos: 0,
    tokens: tokens,
    get: function (i) {
      if (this.eof(i)) {return null;}
      return this.tokens[this.pos + i];
    },
    eof: function (i) { return (this.pos+i) >= this.tokens.length; },
    advance: function (i) {
      other = tokstate(this.tokens);
      other.pos = this.pos + i;
      return other;
    }
  }
}

function parse (tokens) {
  function try_const (state) {
    var tok = state.get(0);
    if (tok.type == "num") {
      return [ {type: "num", val: Number(tok.match)}, tok.advance(1) ];
    }
    if (tok.type == "cons") {
      switch (tok.match) {
        case "true": return [ {type: "bool", val: true}, tok.advance(1) ];
        case "false": return [ {type: "bool", val: false}, tok.advance(1) ];
        case "nil": return [ {type: "nil", val: null}, tok.advance(1) ];
      }
    }
    return null;
  }
  function try_name (state) {
    var tok = state.get(0)
    if (tok.type != "var") return null;
    return tok.match;
  }
  function try_var (state) {
    var result = try_exp(state);
    if (result == null) return null;
    var exp = result[0];
    state = result[1];
    if (state.get(0).match == ".") {
      var attr = try_name(state.advance(1));
      if (attr != null) {
        return [{type: "get", var: exp, attr: {type: "string", val: attr}}, state.advance(2)];
      }
    }
    if (state.get(0).match == "[") {
      var attrx = try_exp(state.advance(1));
      if (attrx) {
        return [ {type: "get", var: exp, attr: attrx[0]}, state.advance(attrx[1]+1) ]
      }
    }
    
    var name = try_name(state);
    if (name != null) return [{type: "name", name: name}, state.advance(1)];
    return null;
  }
  function try_exp (state) {
    return try_var(state);
  }
  var state = tokstate(tokens);
  return try_exp(state)[0];
}

exports.parse = parse;
exports.process = function (str) {return parse(lexer.tokenize(str))};

/* EBNF

const := number | "true" | "false" | "nil"
var := name | exp "." name | exp "[" exp "]"

assign := var { "," var } "=" explist
call := exp "(" [explist] ")"
explist := exp { "," exp }

*/