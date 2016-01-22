// Analizador Léxico de Lua

const pstate = require("./parse_state.js");

function get_fail_lines (str, pos) {
  var startpos = pos;
  var endpos = pos;
  var inpos;
  while (startpos > 0) {
    if (str[startpos] == '\n') {
      startpos = pos + 1;
      break;
    }
    startpos--;
  }
  while (endpos > 0) {
    if (str[endpos] == '\n') {
      endpos = pos;
      break;
    }
    endpos--;
  }
  var inpos = (pos+1)-startpos;
  var pointer = "";
  for (var i = 0; i < inpos; i++) {
    pointer += " ";
  };
  pointer += "^";
  return [str.slice(startpos, endpos), pointer];
}

function token (type, val, pos) {
  return {
    type: type,
    match: val,
    pos: pos
  };
}

function startsWith(str, prefix) {
  return str.slice(0, prefix.length) == prefix;
}

function startsWithAny (str, prefixes) {
  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    if (startsWith(str, prefix)) return prefix;
  };
  return null;
}

function tokenize (instate) {
  var input = instate.input;
  var left = input;
  var tokens = [];
  function fail (msg) {
    instate.fail(msg, input.length-left.length, "lexer");
  }
  function consume (len) { left = left.slice(len); }
  function getpos () { return input.length - left.length; }
  function consume_space () {
    var regex = /[\ \t]*/; // No se consume las nuevas líneas.
    var match = regex.exec(left);
    if (match) { consume(match[0].length); }
  }
  function mRegex (rgx, type) {
    var regex = RegExp('^' + rgx.source);
    var match = regex.exec(left);
    if (match == null) return false;
    var tkn = token(type, match[0], getpos());
    return tkn;
  }
  function mAny (words, type) {
    var match = startsWithAny(left, words);
    if (match == null) return false;
    var tkn = token(type, match, getpos());
    return tkn;
  }
  function pickLonger (toks) {
    // Devuelve el token más largo de la lista.
    // Si dos son del mismo largo, se elige el primero.
    var longer = null;
    for (var i = 0; i < toks.length; i++) {
      var tok = toks[i];
      if (longer == null || tok.match.length > longer.match.length) {
        longer = tok;
      }
    };
    return longer;
  }

  var numrgx = /[0-9]+(\.[0-9]+)?([eE][-+]?[0-9]+)?/;
  var varrgx = /[a-z][a-zA-Z0-9]*/;
  var kws = ["do", "else", "elseif", "end", "for", "function", "if", "in",
             "repeat", "then", "until", "while"];
  var stmts = ["local", "break", "return"];
  var cons = ["true", "false", "nil", "..."];
  var ops = ["+", "-", "*", "/", "%", "^", "<", ">", "==", "<=", ">=", "~=",
             "and", "or", "not", "..", "#"];
  var grammar = ["[", "]", "{", "}", "(", ")", ".", ",", "="];

  var count = 100;
  while (left.length > 0 && count > 0) {
    count--;
    consume_space();
    if (left[0] == "\n" || left[0] == ";") {
      tokens.push(token("nl", left[0]));
      consume(1);
      continue;
    }
    var toks = [];
    function mpush (x) {if (x) {toks.push(x)}}
    mpush(mAny(stmts, "stmt"));
    mpush(mAny(cons, "const"));
    mpush(mAny(kws, "kw"));
    mpush(mAny(ops, "op"));
    mpush(mRegex(numrgx, "num"));
    mpush(mRegex(varrgx, "var"));
    mpush(mAny(grammar, "gmr"));
    var tkn = pickLonger(toks);
    if (tkn == null) fail("Lexer Error: Token Irreconocible");
    tokens.push(tkn);
    consume(tkn.match.length);
  }
  instate.tokens = tokens;
  return tokens;
}

exports.tokenize = tokenize;

// Hay un error con este lexer, "ifyolo" devuelve "if" separado de "yolo",
// en vez de considerarlo todo como un solo

/*
var lexer = require("./lexer.js"); var T = lexer.tokenize;
lexer.tokenize("3 4 5")
*/