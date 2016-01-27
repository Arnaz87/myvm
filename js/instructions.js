// Lista de instrucciones. Módulo: "./instructions.js"

var M = require("./machine.js");

exports.list = [
  {name: "mov", args: 2, desc: "#1=$2 -> $2"},
  {name: "add", args: 3, desc: "#1=$2+$3 -> $1"},
  {name: "sub", args: 3, desc: "#1=$2-$3 -> $1"},
  {name: "div", args: 3, desc: "#1=$2/$3 -> $1"},
  {name: "mul", args: 3, desc: "#1=$2*$3 -> $1"},
  {name: "mod", args: 3, desc: "#1=$2-$3 -> $1"},

  {name: "inc", args: 1, desc: "#1=$1+1 -> $1"},
  {name: "dec", args: 1, desc: "#1=$1-1 -> $1"},
  {name: "neg", args: 1, desc: "#1=0-$1 -> $1"},

  {name: "eq", args: 3, desc: "#1=($2==$3) -> $1"},
  {name: "neq", args: 3, desc: "#1=($2/=$3) -> $1"},
  {name: "lt", args: 3, desc: "#1=($2<$3) -> $1"},
  {name: "lteq", args: 3, desc: "#1=($2<=$3) -> $1"},
  {name: "gtz", args: 2, desc: "#1=($2>0) -> $1"},

  {name: "loadi", args: 2, desc: "#1=#2"},

  {name: "getarg", args: 2, desc: "#1=args[#2] -> $1"},
  {name: "setarg", args: 2, desc: "args[#2]=$1"},
  {name: "jump", args: 1, desc: "goto #1"},
  {name: "jumpif", args: 2, desc: "goto #1 if $2"},
  {name: "jumpifn", args: 2, desc: "goto #1 if not $2"},
  {name: "call", args: 2, desc: "#1(#2)"},
  {name: "end", args: 0, desc: "exit()"},

  // Estas instrucciones no deberían existir, se usan por conveniencia
  // para poder implementar el interprete más rápido.
  {name: "print", args: 1, desc: "print($1)"},
  //{name: "label", args: 1, desc: ":a"},

  // Estas dos deberían cargar desde la tabla de constantes con "loadc".
  // Pero por ahora, no existe tabla de constantes y se cargarán directamente.
  {name: "loadstr", args: 2, desc: "#1=#2 (string)"},
  {name: "module", args: 3, desc: "#1= #2.#3"},
  {name: "loadval", args: 3, desc: "#1=#2"},
  {name: "label", args: 2, desc: ":label #1"},
]

exports.load = function (that) {
  for (var i = 0; i < exports.list.length; i++) {
    var inst = exports.list[i]
    var name = "I" + inst.name;
    that[name] = i;
  };
}

exports.get = function (key) {
  if (exports.list[key]) {return  exports.list[key];}
  for (var i = 0; i < exports.list.length; i++) {
    var inst = exports.list[i]
    var name = inst.name;
    var iname = "I" + name;
    if (key == iname || key == name) {
      return inst;
    }
  };
  return null;
}

exports.toString = function (inst) {
  function gR (i) { return M.state.regs[inst[i]]; }
  function pR (i) { return "["+inst[i]+"="+gR(i)+"]"; }
  var desc = exports.get(inst[0]);
  if (!desc) {
    console.log(inst);
  }
  var val = desc.desc;
  val = val.replace(/\#1/g, inst[1]);
  val = val.replace(/\#2/g, inst[2]);
  val = val.replace(/\#3/g, inst[3]);
  val = val.replace(/\$1/g, pR(1));
  val = val.replace(/\$2/g, pR(2));
  val = val.replace(/\$3/g, pR(3));
  return desc.name + " :: " + val;
}
