// Estructura de la máquina. Modulo: "./machine.js"

// Constante de la máquina.
var M = {};

function machineState () {
  return {
    code: null,
    pc: 0,
    regs: {},
    run: false
  };
}

// En esta implementación, no le ponemos un Heap a la máquina porque usamos
// el propio Heap de Javascript.

// Espacio de registros de la función actual. Aquí es un diccionario para
// simplificar la implementación, pero debería ser un array.
M.state = machineState();

// Stack de espacios de registros. El actual no está en el stack.
M.stack = [];

// Stack de argumentos. Esta implementado como diccionario, pero solo debe
// usarse con llaves numéricas. El atributo length no es el tamaño del array,
// sino el tamaño que definió el que llamó la función.
M.args = {};
M.args.length = 0;

M.run = false;

// Diccionario de módulos cargados.
M.modules = {};

M.popState = function () {
  M.state = M.stack.pop();
}

M.pushState = function () {
  M.stack.push(M.state);
  M.state = machineState();
}

M.loadFunc = function (nfun) {
  if (M.debug > 0) {
    console.log("    [[ Entrando al nivel " + (M.stack.length+1) + " del Stack ]]")
  }
  M.pushState();
  M.state.code = nfun;
  M.state.run = true;
}

M.endFunc = function () {
  if (M.debug > 0) {
    console.log("    [[ Salinedo del nivel " + M.stack.length + " del Stack ]]")
  }
  if (M.stack.length == 0) {
    M.state.run = false;
    M.run = false;
  } else {
    M.popState();
  }
}

M.debug = 500; // Tiempo para esperar entre isntrucciones, en milisegundos, o
               // 0 para no esperar y no imprimir información de depuración.

module.exports = M;