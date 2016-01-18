var M = require("./machine.js");
const m = require("./module.js");
m.instructions(global);
var out = [];
var mod = {
  name: "Main",
  mainx: [
    [Iloadstr, "text", "Hola Mundo!"],
    [Imodule, "print", "Main", "myprint"],
    [Isetarg, "text", 0],
    [Icall, "print"],
    //[Iprint, "text"],
    [Iend]
  ],
  main: [
    [Imodule, "print", "Main", "print"],
    [Iloadstr, "str1", "Start Value:"],
    [Iloadstr, "str2", "End Value:"],

    [Iloadi, "x", 1],
    [Iloadi, "y", 1000],
    [Isetarg, "str1", 0], [Icall, "print"],
    [Isetarg, "x", 0], [Icall, "print"],
    [Isetarg, "y", 0], [Icall, "print"],

    [Imodule, "run", "Main", "add"],
    [Isetarg, "x", 0], [Isetarg, "y", 1],

    [Icall, "run"],

    [Igetarg, "z", 0],
    [Isetarg, "str2", 0], [Icall, "print"],
    [Isetarg, "z", 0], [Icall, "print"],

    //[Imodule, "end", "Main", "end"], [Icall, "end"],
    [Iend]
  ],
  mult: [
    [Imodule, "add", "Main", "add"],
    [Igetarg, "n", 0], // line 1
    [Igetarg, "m", 1],
    [Imov, "r", "n"],
    [Igtz, "cond", "m"], // line 4
    [Ijumpifn, 12, "cond"],
    [Isetarg, "n", 0],
    [Isetarg, "r", 1],
    [Icall, "add"],
    [Igetarg, "r", 0],
    [Idec, "m"],
    [Ijump, 4],
    [Isetarg, "r", 0], // line 12
    [Iend]
  ],
  add: [
    [Igetarg, "n", 0], // line 0
    [Igetarg, "m", 1],
    [Igtz, "cond", "m"], // line 2
    [Ijumpifn, 7, "cond"],
    [Iinc, "n"],
    [Idec, "m"],
    [Ijump, 2],
    [Isetarg, "n", 0], // line 7
    [Iend]
  ],
  add1: [
    [Iloadi, "one", 1],
    [Igetarg, "x", 0],
    [Iadd, "result", "one", "x"],
    [Isetarg, "result", 0],
    [Iend]
  ],
  myprint: [
    [Iloadstr, "test", "Imprimiendo..."],
    [Igetarg, "text", 0],
    [Iprint, "test"],
    [Iprint, "text"],
    [Iend]
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