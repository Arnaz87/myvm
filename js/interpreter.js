// Interprete de instrucciones. Modulo: "./interpreter.js"

var M = require("./machine.js");
var instructions = require("./instructions.js");
instructions.load(this);

// program es una lista de instrucciones. Tiene la forma:
// [[Iload, 0, 1], [Iload, 1 2], [Iadd, 2, 0, 1]]

function exec (inst) {
  // gR: get register, sR: set register.
  function gR (i) { return M.state.regs[inst[i]]; }
  function sR (i, val) { M.state.regs[inst[i]] = val; }

  var advance = true;
  var docall = false;
  function setpc (i) {
    M.state.pc = inst[i];
    advance = false;
  }
  switch (inst[0]) {
    case Iadd: sR(1, gR(2) + gR(3)); break;
    case Isub: sR(1, gR(2) - gR(3)); break;
    case Imul: sR(1, gR(2) * gR(3)); break;
    case Idiv: sR(1, gR(2) / gR(3)); break;
    case Imod: sR(1, gR(2) % gR(3)); break;
    case Iinc: sR(1, gR(1) + 1); break;
    case Idec: sR(1, gR(1) - 1); break;

    case Isetarg: M.args[inst[2]]=gR(1); break;
    case Igetarg: sR(1,M.args[inst[2]]); break;

    case Ieq: sR(1, gR(2) == gR(3)); break;
    case Ilt: sR(1, gR(2) < gR(3)); break;
    case Ilteq: sR(1, gR(2) <= gR(3)); break;
    case Igtz: sR(1, gR(2) > 0); break;

    case Iloadi: sR(1, inst[2]); break;
    case Icall: docall = true; break;

    case Ijump: setpc(1); break;
    case Ijumpif: if (gR(2)) { setpc(1) }; break;
    case Ijumpifn: if (!gR(2)) { setpc(1) }; break;

    case Iloadstr: sR(1, inst[2]); break;
    case Iprint: console.log(gR(1)); break;
    case Imodule: sR(1, M.modules[inst[2]][inst[3]]); break;
    case Iend: M.endFunc(); advance=false; break;
  }
  if (advance) {
    M.state.pc++;
  }
  if (docall) {
    mcall(gR(1), inst[2])
  }
}

function mcall (fun, len) {
  if (typeof fun == "function") {
    fun();
  } else {
    M.loadFunc(fun);
  }
}

function execLoop () {
  var S = M.state;
  var inst = S.code[S.pc];
  if (M.debug > 0) { console.log("  " +instructions.toString(inst)); }
  exec(inst);
  if (S.pc >= S.code.length) {
    M.run = false;
  }
  if (M.run) {
    setTimeout(execLoop, M.debug);
  }
}

exports.exec = exec;
exports.execLoop = execLoop;
