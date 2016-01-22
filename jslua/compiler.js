function compile_state () {
  return {
    ast: null,
    vars: {},
    consts: {},
    code: [],
    labels: {},
    lastlabel: 0,
    lastconst: 0,
    lastscope: 0,
    create_label: function (name) {
      if (!name) { name = "_L" + lastlabel++; }
      this.labels[name] = this.code.length;
      return name;
    }
    add_const: function (val) {
      var name = "_C" + lastconst++;
      this.consts[name] = val;
      return name;
    }
  }
}

function compile_ast (ast, state) {

}