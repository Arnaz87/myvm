const fs = require('fs');
const lexer = require("./lexer.js");
const parser = require("./parser.js");

function parse (str) { return parser.parse(lexer.tokenize(str)); }

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
  var ast = parse(data);
  var json = JSON.stringify(ast, null, 2);
  fs.writeFile(outfile, json);
});


exports.parse = parse;