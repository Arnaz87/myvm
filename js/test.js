var M = require("./machine.js");
const m = require("./module.js");
m.instructions(global);
var out = [];
var mod = {
  name: "Main",
  mainx: [
    ["loadval", "text", "Hola Mundo!"],
    ["module", "print", "Main", "myprint"],
    ["setarg", "text", 0],
    ["call", "print"],
    //["print", "text"],
    ["end"]
  ],
  main: [
    ["module", "print", "Main", "print"],
    ["loadval", "str1", "Start Value:"],
    ["loadval", "str2", "End Value:"],

    ["loadval", "x", 6],
    ["loadval", "y", 5],
    ["setarg", "str1", 0], ["call", "print"],
    ["setarg", "x", 0], ["call", "print"],
    ["setarg", "y", 0], ["call", "print"],

    ["module", "run", "Main", "mult"],
    ["setarg", "x", 0], ["setarg", "y", 1],

    ["call", "run"],

    ["getarg", "z", 0],
    ["setarg", "str2", 0], ["call", "print"],
    ["setarg", "z", 0], ["call", "print"],

    //["module", "end", "Main", "end"], ["call", "end"],
    ["end"]
  ],
  mult: [
    ["module", "add", "Main", "add"],
    ["getarg", "n", 0],
    ["getarg", "m", 1],
    ["mov", "r", "n"],
    ["label", "start"], // label
    ["gtz", "cond", "m"],
    ["jumpifn", "end", "cond"],
    ["setarg", "n", 0],
    ["setarg", "r", 1],
    ["call", "add"],
    ["getarg", "r", 0],
    ["dec", "m"],
    ["jump", "start"],
    ["label", "end"], // label
    ["setarg", "r", 0],
    ["end"]
  ],
  add: [
    ["getarg", "n", 0],
    ["getarg", "m", 1],
    ["label", "start"], // label
    ["gtz", "cond", "m"],
    ["jumpifn", "end", "cond"],
    ["inc", "n"],
    ["dec", "m"],
    ["jump", "start"],
    ["label", "end"], // label
    ["setarg", "n", 0],
    ["end"]
  ],
  add1: [
    ["loadval", "one", 1],
    ["getarg", "x", 0],
    ["add", "result", "one", "x"],
    ["setarg", "result", 0],
    ["end"]
  ],
  myprint: [
    ["loadval", "test", "Imprimiendo..."],
    ["getarg", "text", 0],
    ["print", "test"],
    ["print", "text"],
    ["end"]
  ],
  setDebug: function () {
    M.debug = (M.args[0]);
  },
  print: function () {
    out.push(M.args[0]);
    console.log(M.args[0]);
  },
  end: function () {
    console.log("\nProgram Out:\n");
    for (var i = 0; i < out.length; i++) {
      console.log(out[i]);
    }
    console.log("\n");
  }
}
M.debug = 0;
m.load(mod);
m.run();