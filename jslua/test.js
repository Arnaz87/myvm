const fs = require('fs');
const state = require("./parse_state.js");
const lexer = require("./lexer.js");
const parser = require("./parser.js");

function parse (str) {
  var st = state.state(str);
  lexer.tokenize(st);
  parser.parse(st);
  return st;
}

// process.argv contiene argumentos.
// argv[0]: 'node'
// argv[1]: archivo de js
// argv[2]: primer argumento
// argv[3]: segundo argumento, etc...

if (process.argv[2] == "-h") {
  console.log("Proces a file and output the AST in json.")
  console.log("Usage: cmd infile outfile.");
  proces.exit();
}

var infile = process.argv[2];
var outfile = process.argv[3];

fs.readFile(infile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
    process.exit();
  }
  console.log(JSON.stringify(data));
  var state = parse(data);
  console.log(state.tostr());
  var json = JSON.stringify(state.ast, null, 2);
  fs.writeFile(outfile, json);
});


exports.parse = parse;