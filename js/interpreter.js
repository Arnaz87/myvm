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
  function jumpto (name) {
    var lbl = M.state.labels[name];
    //console.log("jumping to " + name + ": " + lbl);
    if (lbl === null || lbl === undefined) {
      throw new Error("Undefined label: " + name);
    }
    M.state.pc = lbl;
    advance = false;
  }
  switch (inst[0]) {
    case "mov": sR(1, gR(2)); break;
    case "add": sR(1, gR(2) + gR(3)); break;
    case "sub": sR(1, gR(2) - gR(3)); break;
    case "mul": sR(1, gR(2) * gR(3)); break;
    case "div": sR(1, gR(2) / gR(3)); break;
    case "mod": sR(1, gR(2) % gR(3)); break;
    case "inc": sR(1, gR(1) + 1); break;
    case "dec": sR(1, gR(1) - 1); break;

    case "setarg": M.args[inst[2]]=gR(1); break;
    case "getarg": sR(1,M.args[inst[2]]); break;

    case "eq": sR(1, gR(2) == gR(3)); break;
    case "lt": sR(1, gR(2) < gR(3)); break;
    case "lteq": sR(1, gR(2) <= gR(3)); break;
    case "gtz": sR(1, gR(2) > 0); break;

    //case "loadi": sR(1, inst[2]); break;
    case "call": docall = true; break;

    case "jump": jumpto(inst[1]); break;
    case "jumpif": if (gR(2)) { jumpto(inst[1]) }; break;
    case "jumpifn": if (!gR(2)) { jumpto(inst[1]) }; break;

    //case "loadstr": sR(1, inst[2]); break;
    case "print": console.log(gR(1)); break;
    case "module": sR(1, M.modules[inst[2]][inst[3]]); break;
    case "label": break;
    case "end": M.endFunc(); advance=false; break;
    case "loadval": sR(1, inst[2]); break; // Por ahora este en vez de loadi...
    default: throw new Error("Unrecognized instruction: " + inst[0]);
  }
  if (advance) {
    M.state.pc++;
  }
  if (docall) {
    mcall(gR(1), inst[2])
  }
}

function compileLabels () {
  M.state.labels = {};
  for (var i = 0; i < M.state.code.length; i++) {
    var inst = M.state.code[i]
    if (inst[0] == "label") {
      M.state.labels[inst[1]] = i;
    }
  };
  //console.log(M.state.labels);
}

function mcall (fun, len) {
  if (typeof fun == "function") {
    fun();
  } else {
    M.loadFunc(fun);
    compileLabels();
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
exports.compileLabels = compileLabels;
