
function get_fail_lines (str, pos) {
  var startpos = pos;
  var endpos = pos;
  var inpos;
  while (startpos > 0) {
    if (str[startpos] == '\n') {
      startpos = pos + 1;
      break;
    }
    startpos--;
  }
  while (endpos <= str.length) {
    if (str[endpos] == '\n') {
      endpos = pos;
      break;
    }
    endpos++;
  }
  var inpos = (pos)-startpos;
  var pointer = "";
  for (var i = 0; i < inpos; i++) {
    pointer += " ";
  };
  pointer += "^";
  return [str.slice(startpos, endpos), pointer];
}

function get_line_num (str, pos) {
  var count = 1;
  while (pos > 0) {
    if (str[pos] == '\n') {
      count++;
    }
    pos--;
  }
  return count;
}

function capitalize (str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

function state (input) {
  return {
    input: input,
    tokenized: false,
    parsed: false,
    compiled: false,
    refined: false,
    fail: function (msg, pos, type) {
      console.log(this.tostr());
      var isparser = type == "parser";
      var iseof = pos == "eof";
      var str = capitalize(type) + " error: ";
      if (iseof) {
        str  += ". at: End of File!";
      } else {
        var line = get_line_num(input, pos);
        var lines = get_fail_lines(input, pos);
        str += msg + ". at: " + pos + ", line: " + line;
        str += "\n" + lines[0] + "\n" + lines[1];
      }
      throw new Error(str);
    },
    tostr: function () {
      var str = "";
      if (this.tokens) {
        str += "tokens:\n"
        for (var i = 0; i < this.tokens.length; i++) {
          var tkn = this.tokens[i];
          str += "  " + JSON.stringify(tkn) + "\n";
        };
      }
      if (this.ast) {
        str += "syntax tree:\n";
        str += JSON.stringify(this.ast, null, 2);
      }
      return str;
    }
  };
}

exports.state = state;