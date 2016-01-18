// Cargador de módulos. archivo: "./module.js"

/* Este cargador es muy diferente a la implementación, no carga modulos
 * compilados binarios, en realidad es una librería para que un archivo que
 * defina los modulos en javascript inicie el programa por si mismo.
 */

const M = require("./machine.js");
const instructions = require("./instructions.js");
const interpreter = require("./interpreter.js");

function execute (program) {
  M.state.code = program;
  M.state.pc = 0;
  M.state.run = true;
  M.run = true;
  interpreter.execLoop();
}

function load (module) {
  M.modules[module.name] = module;
}

function run () {
  execute(M.modules["Main"]["main"]);
}

exports.load = load;
exports.instructions = instructions.load;
exports.run = run;
exports.execLoop = interpreter.execLoop;
exports.setDebug = interpreter.setDebug;