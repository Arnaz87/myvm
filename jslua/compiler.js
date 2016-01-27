function compiler_state (ncode) {
  if (!ncode) {ncode = [];}
  return {
    consts: {},
    code: ncode,
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
    },
    push: function () {
      this.code.push(Array.prototype.slice.call(arguments));
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

function compile_code (st_ast, state) {
  if (!state) { state = compiler_state(); }
  function compile_const (ast) {
    var name = state.get_temp()
    state.push("loadval", name, ast.value);
    return name;
  }
  function compile_binop (ast) {
    var op = ops[ast.op];
    var left = compile_exp(ast.left);
    var right = compile_exp(ast.right);
    var name = state.get_temp();
    // TODO: Arreglar lo de reversed
    state.push(op, name, left, right);
    return name;
  }
  function compile_field (ast) {
    var left = compile_exp(ast.var);
    var field = compile_exp(ast.field);
    var result = state.get_temp();
    state.push("setarg", left, 0);
    state.push("setarg", field, 1);
    state.push("call", "__get", 2);
    state.push("getarg", result, 0);
    return result;
  }
  function compile_call (ast) {
    var fun = compile_exp(ast["var"]);
    args = [];
    for (var i = 0; i < ast.args.length; i++) {
      args[i] = compile_exp(ast.args[i]);
    };
    for (var i = 0; i < args.length; i++) {
      state.push("setarg", args[i], i);
    };
    state.push("call", fun, args.length);
    var result = state.get_temp();
    state.push("getarg", result, 0);
    return result;
    // No puede devolver multiples resultados, solo el primero.
  }
  function compile_table (ast) {
    var table = state.get_temp();
    state.push("call", "__table", 0);
    state.push("getarg", table, 0);
    var arrpos = 0;
    for (var i = 0; i < ast.fields.length; i++) {
      var field = ast.fields[i]
      switch (field.type) {
        case "field":
          var name = compile_exp(field.name);
          break;
        case "arr":
          var name = state.get_temp();
          state.push("loadval", name, arrpos);
          arrpos++;
          break;
      }
      var value = compile_exp(field.value);
      state.push("setarg", table, 0);
      state.push("setarg", name,  1);
      state.push("setarg", value, 2);
      state.push("call", "__set", 3);
    };
    return table;
  }
  function compile_exp (ast) {
    switch (ast.type) {
      case "var": return ast.name;
      case "num":
      case "str":
      case "bool":
        return compile_const(ast);
      case "binop":
        return compile_binop(ast);
      case "field":
        return compile_field(ast);
      case "call":
        return compile_call(ast);
      case "table":
        return compile_table(ast);
    }
    //throw new Error("Unrecognized expression AST type: " + ast.type);
  }
  function compile_if (ast) {
    var else_label = state.get_label();
    var end_label = state.get_label();
    for (var i = 0; i < ast.ifs.length; i++) {
      var next_label = state.get_label();
      var result = compile_exp(ast.ifs[i].cond);
      state.push("jumpifn", next_label, result)
      compile_block(ast.ifs[i].block);
      state.push("jump", end_label);
      state.push("label", next_label);
    };
    state.push("label", else_label)
    if (ast["else"] !== null) {
      compile_block(ast["else"])
    }
    state.push("label", end_label);
  }
  function compile_while (ast) {
    // TODO:
    // Limpiar aquí...
    var cond_label = state.get_label();
    var block_label = state.get_label();
    var end_label = state.get_label();
    state.push("label", cond_label);
    var result = compile_exp(ast.cond);
    state.push("jumpif", block_label, result);
    state.push("jump", end_label);
    state.push("label", block_label);
    compile_block(ast.block);
    state.push("jump", cond_label);
    state.push("label", end_label);
  }
  function single_assign (left, right) {
    // Por ahora, solo voy a asignar variables, no campos de objetos.
    var result = compile_exp(right);
    switch (left.type) {
      case "var":
        state.push("mov", left.name, result);
        break;
      case "field":
        var v = compile_exp(left.var);
        var field = compile_exp(left.field);
        state.push("setarg", v, 0);
        state.push("setarg", field, 1);
        state.push("setarg", result, 2);
        state.push("call", "__set", 3);
        break;
    }
  }
  function compile_assign (ast) {
    for (var i = 0; i < ast.vars.length && i < ast.exps.length; i++) {
      single_assign(ast.vars[i], ast.exps[i]);
    };
  }
  function compile_stat (ast) {
    switch (ast.type) {
      case "assign":
        return compile_assign(ast);
      case "call":
        return compile_call(ast);
      case "if":
        return compile_if(ast);
      case "while":
        return compile_while(ast);
    }
    //throw new Error("Unrecognized statement AST type: " + ast.type);
  }
  function compile_block (ast) {
    for (var i = 0; i < ast.seq.length; i++) {
      var stat = ast.seq[i];
      compile_stat(stat);
    };
  }
  compile_block(st_ast);
}

function compile_func (ast, state) {
  if (!state) { state = compiler_state(); }
  return compile_code(ast, state);
}

function compile (instate) {
  if (instate.compiled) {
    console.log("Already compiled!");
    return instate.code;
  }
  state = compiler_state();
  compile_code(instate.ast, state)
  instate.code = state.code;
  instate.compiled = true;
  return instate.code;
}

exports.compile = compile;