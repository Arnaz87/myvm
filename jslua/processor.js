const state = require("./parse_state.js");
const lexer = require("./lexer.js");
const parser = require("./parser.js");
const compiler = require("./compiler.js");

function process_input (str) {
  var st = state.state(str);
  exports.last = st;
  lexer.tokenize(st);
  parser.parse(st);
  //compiler.compile(st);
  return st;
}

exports.last = null;
exports.tokenize = lexer.tokenize;
exports.parse = parser.parse;
exports.compile = compiler.compile;
exports.process = process_input;