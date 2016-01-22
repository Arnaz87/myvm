function compiler_state () {
  return {
    ast: null,
    vars: {},
    consts: {},
    code: [],
    labels: {},
    lastlabel: 0,
    lastconst: 0,
    lasttemp: 0,
    get_label: function () {
      return "_label_" + this.lastlabel++;
    },
    add_const: function (val) {
      var name = "_C" + lastconst++;
      this.consts[name] = val;
      return name;
    },
    get_temp: function () {
      return "_temp_" + this.lasttemp++;
    }
  }
}
function contains (arr, x) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == x) return true;
  };
  return false;
}

var ops = {
  "+": "add",
  "-": "sub",
  "*": "mul",
  "/": "div",
  "**": "exp",
  "==": "eq",
  "~=": "neq",
  "<": "lt",
  "<=": "lteq",
  ">": "lt", // reversed
  ">=": "lteq", //reversed
  "and": "and",
  "or": "or"
}
var reversed = [">", ">="];

function compile (instate) {
  if (instate.compiled) {
    console.log("Already compiled!");
    return instate.code;
  }
  var state = compiler_state();

  function compile_const (ast) {
    var name = state.get_temp();
    state.code.push(["loadi", name, ast.value]);
    return name;
  }
  function compile_binop (ast) {
    console.log(ast);
    var op = ops[ast.op];
    var name = state.get_temp();
    var left = compile_value(ast.left);
    var right = compile_value(ast.right);
    if (contains(reversed, ast.op)) {
      var tmp = left; left = right; right = tmp;
    }
    state.code.push([op, name, left, right]);
    return name;
  }
  function compile_assign (ast) {
    // Esto solo es por ahora, porque aún no tengo una estructura para tablas.
    if (ast.var.type != "var") return null;
    var name = ast.var.value;
    var val = compile_value(ast.val);
    state.code.push(["mov", name, val]);
  }
  function compile_if (ast) {
    var l_if = state.get_label();
    var l_else = state.get_label();
    var l_end = state.get_label();
    var result = state.get_temp();

    var cond = compile_value(ast.cond);
    state.code.push(["jumpifn", l_else, cond]);

    state.code.push(["label", l_if])
    var v_if = compile_value(ast.block);
    state.code.push(["mov", result, v_if]);
    state.code.push(["jump", l_end]);

    state.code.push(["label", l_else])
    var v_else = compile_value(ast["else"]);
    state.code.push(["mov", result, v_else]);

    state.code.push(["label", l_end])
    return result;
  }
  function compile_while (ast) {
    var l_start = state.get_label();
    var l_block = state.get_label();
    var l_end   = state.get_label();
    var result = state.get_temp();

    state.code.push(["label", l_start])
    var cond = compile_value(ast.cond);
    state.code.push(["jumpifn", l_end, cond]);

    state.code.push(["label", l_block]);
    var v_block = compile_value(ast.block);
    state.code.push(["mov", result, v_block]);
    state.code.push(["jump", l_start]);

    state.code.push(["label", l_end]);
    return result;
  }
  function compile_seq (ast) {
    var seq = ast.seq;
    var last = null;
    for (var i = 0; i < seq.length; i++) {
      last = compile_value(seq[i]);
    };
    return last;
  }
  function compile_value (ast) {
    switch (ast.type) {
      case "seq": return compile_seq(ast);
      case "nil": return "_nil";
      case "num":
      case "str":
      case "bool":
        return compile_const(ast);
      case "var":
        return ast.value;
      case "binop":
        return compile_binop(ast);
      case "assign":
        return compile_assign(ast);
      case "if":
        return compile_if(ast);
      case "while":
        return compile_while(ast);
    }
  }

  compile_value(instate.ast);
  
  instate.code = state.code;
  instate.compiled = true;
  return instate.code;
}

exports.compile = compile;