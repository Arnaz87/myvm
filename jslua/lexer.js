// Analizador Léxico de Lua

function token (type, val, matchlen) {
  return {
    type: type,
    match: val
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

function tryRegex (str, inregex, type) {
  var regex = RegExp('^' + inregex.source);
  var match = regex.exec(str);
  if (match == null) return null;
  return token(type, match[0]);
}

function tryAny (str, words, type) {
  var match = startsWithAny(str, words);
  if (match == null) { return null; }
  return token(type, match, match.length);
}

function tokenize (input) {
  var left = input;
  var tokens = [];
  function consume (len) {
    left = left.slice(len);
  }
  function consume_space () {
    var regex = /[\ \t]*/; // No se consume las nuevas líneas.
    var match = regex.exec(left);
    if (match) { consume(match[0].length); }
  }
  function mtry (tkn) {
    if (tkn == null) { return false; }
    tokens.push(tkn);
    consume(tkn.match.length);
    return true;
  }
  function mRegex (rgx, type) {
    return mtry(tryRegex(left, rgx, type));
  }
  function mAny (words, type) {
    return mtry(tryAny(left, words, type));
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
    throw new Error("Lexer Error: Token Irreconocible.\nat: " + (input.length-left.length));
  }
  return tokens;
}

exports.tokenize = tokenize;
/*
var lexer = require("./lexer.js"); var T = lexer.tokenize;
lexer.tokenize("3 4 5")
*/