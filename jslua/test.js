const fs = require('fs');
const state = require("./parse_state.js");
const processor = require("./processor.js");

const machine = require("../js/machine.js");
var module = require("../js/module.js");

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

//var infile = process.argv[2];
//var outfile = process.argv[3];

var infile = "test.lua";
var outfile = "test.json";

fs.readFile(infile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
    process.exit();
  }
  //console.log(JSON.stringify(data));
  var state = processor.process(data);
  //console.log(state.tostr());
  console.log("Writing data to " + outfile);
  fs.writeFile(outfile, state.tostr());
  /*console.log("Ejecutar");
  execute(state);*/
});

function execute (state) {
  var start_code = [
    ["module", "print", "Main", "print"]
  ];
  var mod = {
    name: "Main",
    main: start_code.concat(state.code),
    print: function () {
      console.log(machine.args[0]);
    }
  }
  machine.debug = 0;
  module.load(mod);
  console.log("Módulo cargado, ejecutando...")
  console.log("-----")
  module.run();
}