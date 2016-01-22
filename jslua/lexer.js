// Analizador Léxico de Lua

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

function tokenize (input) {
  var left = input;
  var tokens = [];
  function fail (msg) {
    var pos = (input.length-left.length);
    var lines = get_fail_lines(input, pos);
    var str = "Lexer Error: Token Irreconocible.\nat: " + pos;
    str += '\n' + lines[0] + '\n' + lines[1];
    console.log(input);
    console.log(tokens);
    throw new Error(str);
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
    tokens.push(tkn);
    consume(tkn.match.length);
    return true;
  }
  function mAny (words, type) {
    var match = startsWithAny(left, words);
    if (match == null) return false;
    var tkn = token(type, match, getpos());
    tokens.push(tkn);
    consume(tkn.match.length);
    return true;
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
    if (mAny(stmts, "stmt")) continue;
    if (mAny(cons, "const")) continue;
    if (mAny(kws, "kw")) continue;
    if (mAny(ops, "op")) continue;
    if (mRegex(numrgx, "num")) continue;
    if (mRegex(varrgx, "var")) continue;
    if (mAny(grammar, "gmr")) continue;
    fail("Lexer Error: Token Irreconocible");
  }
  return tokens;
}

exports.tokenize = tokenize;

// Hay un error con este lexer, "ifyolo" devuelve "if" separado de "yolo",
// en vez de considerarlo todo como un solo

/*
var lexer = require("./lexer.js"); var T = lexer.tokenize;
lexer.tokenize("3 4 5")
*/