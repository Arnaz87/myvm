// Analizador Sintáctico de Lua

const pstate = require("./parse_state.js");

function parse (instate) {
  if (instate.parsed) {
    console.log("Already parsed!");
    return instate.ast;
  }
  var tokens = instate.tokens;
  // Token State
  var pos = 0;
  function peek (i) {
    i = i? i : 0;
    return tokens[pos + i];
  }
  function consume (i) {
    i = i? i : 1;
    var tok = peek(i-1);
    pos += i;
    return tok;
  }
  function eof() {return pos >= tokens.length;}
  function fail (txt) {
    instate.fail(txt, eof()?"eof":peek().pos, "parser");
  }
  function fail_if (x, txt) { if (x) { fail(txt); } }
  function fail_ifn (x, txt) { fail_if(!x, txt); }
  function fail_null (x, txt) { fail_if(x === null, txt); return x; }

  // Basic token Helpers
  var nil_const = {type: "nil", val: "nil"};
  function try_name () {
    if (eof()) return false;
    if (peek().type == "var") return consume().match;
    return null;
  }
  function try_grammar (test) {
    if (eof()) return false;
    var p = peek();
    if (p.type == "gmr" && p.match == test) {
      consume();
      return true;
    }
    return false;
  }
  function try_kw (test) {
    if (eof()) return false;
    var p = peek();
    if (p.type == "kw" && p.match == test) {
      consume();
      return true;
    }
    return false;
  }
  function try_any (funcs) {
    for (var i = 0; i < funcs.length; i++) {
      var result = funcs[i]();
      if (result !== null) return result;
    };
    return null;
  }

  // Operators
  var binops = {
    "or": 1,
    "and": 2,
    "<":  3, ">":  3,
    "<=": 3, ">=": 3,
    "~=": 3, "==": 3, // prefiero != a ~=
    "..": 4, // prefiero ++
    "+": 5,
    "-": 5,
    "*": 6,
    "/": 6,
    "**": 7
  }
  var unops = {
    "not": 2,
    "#": 10,
    "-": 10
  }
  function match_op (op, ind, val) {
    for (var i = 0; i < ops.length; i++) {
      var o = ops[i]
      if (o[0] == op && o[ind] == val) return true;
    };
    return null;
  }
  function try_unop () {
    if (eof()) return null;
    var tok = peek();
    if (tok.type != "op") return null;
    var op = tok.match;
    if (unops[op] === undefined) return null;
    consume();
    return {op: op, prec: unops[op]};
  }
  function peek_binop () {
    if (eof()) return null;
    var tok = peek();
    if (tok.type != "op") return null;
    var op = tok.match;
    if (binops[op] === undefined) return null;
    //consume();
    return {op: op, prec: binops[op]};
  }

  // Value parsers
  function parse_number () {
    var tok = peek();
    if (tok.type != "num") return null;
    consume();
    return {type: "num", value: Number(tok.match)}
  }
  function parse_bool () {
    var tok = peek();
    if (tok.type != "const") return null;
    var r = null;
    switch (tok.match) {
      case "true": r = {type: "bool", value: true}; break;
      case "false": r = {type: "bool", value: true}; break;
    }
    if (r === null) return null;
    consume();
    return r;
  }
  function parse_string () {
    var tok = peek();
    if (tok.type != "str") return null;
    consume();
    var val = tok.match.slice(1,-1); // Eliminar el primer y el último caracter. En este caso las comillas.
    val = val.replace(/\\"/, '"');
    val = val.replace(/\\'/, "'"); // Reemplazar las secuencias de escape.
    return {type: "str", val: val};
  }
  function parse_nil () {
    var tok = peek();
    if (tok.type != "const") return null;
    if (tok.match != "nil") return null;
    consume();
    return nil_const;
  }

  // AST parsers
  function parse_cons () {
    return try_any([
      parse_number,
      parse_bool,
      parse_string,
      parse_nil,
    ]);
  }
  function parse_var () {
    var name = try_name();
    if (name == null) return null;
    var current = {type: "var", value: name};
    while (true) {
      if (try_grammar(".")) {
        var name = try_name();
        if (name == null) fail("Expected field access name.");
        current = {
          type: "field",
          obj: current,
          field: {
            type: "string",
            val: name
          }
        };
        continue;
      }
      if (try_grammar("[")) {
        var exp = parse_exp();
        if (exp == null) fail("Expected expression field access.");
        current = {
          type: "field",
          obj: current,
          field: exp
        };
        if (!try_grammar("]")) fail("Expected Closing Bracket.");
        continue;
      }
      break;
    }
    return current;
  }
  function parse_var_call_assign () {
    var v = parse_var();
    if (v == null) return null;
    if (try_grammar("=")) {
      var exp = fail_null(parse_exp(), "Expected expression for asign");
      return {type: "assign", var: v, val: exp};
    }
    if (try_grammar("(")) {
      var args = [];
      var first = true;
      while (true) {
        if (try_grammar(")")) break;
        if (!first && !try_grammar(",")) {
          fail("Expected comma for argument list");
        }
        first = false;
        var a = parse_exp();
        if (a == null) fail("Expected expression for argument list");
        args.push(a);
      }
      return {type: "call", var: v, args: args};
    }
    return v;
  }
  function parse_if () {
    if (!try_kw("if")) return null;
    var cond = fail_null(parse_exp(), "Expected an if condition expression");
    fail_if(!try_kw("then"), "Expected block then keyword");
    var block = fail_null(parse_seq(), "Expected an if block")
    var elseb = nil_const;
    if (try_kw("else")) {
      elseb = fail_null(parse_seq(), "Expected an else block");
    }
    fail_if(!try_kw("end"), "Expected end keyword after block.");
    return {type: "if", cond: cond, block: block, "else": elseb};
  }
  function parse_while () {
    if (!try_kw("while")) return null;
    var cond = fail_null(parse_exp(), "Expected a while condition expression");
    fail_if(!try_kw("do"), "Expected block do keyword");
    var block = fail_null(parse_seq(), "Expected a while block");
    fail_if(!try_kw("end"), "Expected end keyword after block.");
    return {type: "while", cond: cond, block: block};
  }
  function parse_atom () {
    function in_parens () {
      if (!try_grammar("(")) return null;
      var exp = parse_exp();
      if (!try_grammar(")")) fail("Expected close parenthesis")
      return exp;
    }
    function in_unop () {
      var op = try_unop();
      if (op == null) return null;
      var exp = parse_exp();
      return {type: "unop", op: op, exp: exp};
    }
    if (eof()) return null;
    var exp = try_any([
      //in_unop,
      in_parens,
      parse_if,
      parse_while,
      parse_cons,
      parse_var_call_assign
    ]);
    return exp;
  }
  function parse_seq () {
    var exps = [];
    while (true) {
      var exp = parse_exp();
      if (exp != null) exps.push(exp);
      if (eof()) break;
      if (peek().type != "nl") break;
      consume();
    }
    return {type: "seq", seq: exps};
  }
  function parse_exp () {
    return parse_bin(parse_atom(), 0);
  }
  function parse_bin (left, left_prec) {
    while (true) {
      var op = peek_binop();
      if (op == null || op.prec < left_prec) return left;
      consume();
      var right = parse_atom();
      var next = peek_binop();
      // Cuidado con esta línea. Hay que usar op.prec, porque con la expresión
      // a+b+c, parsebin empieza con a y leftprec=0, y como + con prec 1 es
      // mayor que 0, lo asocia a la derecha, aún cuando no debería hacerlo.
      // Luego con b, leftprec sí sería 1 y se comportaría bien, pero el
      // primero siempre quedaría mal asociado. Para evitar esto, usamos
      // op.prec.
      if (next != null && next.prec > op.prec) {
        right = parse_bin(right, next.prec);
      }
      left = {type: "binop", op: op.op, left: left, right: right};
    }
  }

  var result = parse_seq();
  console.log("Parser consumed " + pos + " of " + tokens.length + " tokens.")
  instate.ast = result;
  instate.parsed = true;
  return result;
}

exports.parse = parse;

/* EBNF

const := number | "true" | "false" | "nil"
var := name | ( name | "(" exp ")" ) ("." name | "[" exp "]" )

call := var "(" [explist] ")"
explist := exp { "," exp }

exp := number
exp := string
exp := boolean
exp := table
exp := var
exp := call
exp := exp binop exp
exp := unop exp

assign := var { "," var } "=" explist

ifstat := "if" exp "then" block ["else" block] "end"
whilestat := "while" exp "do" block "end"
forstat := "for" name "," name "in" exp "do" block "end"

stat := assign | call | ifstat | whilestat | forstat

*/