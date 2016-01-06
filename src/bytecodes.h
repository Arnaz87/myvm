#ifndef VM_BYTECODES
#define VM_BYTECODES

enum instruction {
  none,
  end,
  add,    // A = B + C
  mult,   // A = B * C
  div,    // A = B / C
  neg,    // A = -B
  eq,     // A = B == C
  lt,     // A = B <  C
  lteq,   // A = B <= C
  jumpif, // if B: pc = a
  jump,   // pc = a
  print,  // print( A )
  printc, // printchar( A )
  alloc,  // A = heap_alloc(b) // Debeŕía hacerse con un ncall
  getbyte,// A = B[c]
  setbyte,// B[c] = A
  loadi,  // A = b
  setarg, // Args[a] = B
  getarg, // A = Args[b]
  call,   // A.call()
  ncall,  // Native_call( A )
  debug,
  debuga,
  module, // B = loadModule( B ) // String B
  get,    // A = B[C]
  set,    // B[C] = A
};

static const char *inst_strings[] = {
  "none",
  "end",
  "add",
  "mult",
  "div",
  "neg",
  "eq",
  "lt",
  "lteq",
  "jumpif",
  "jump",
  "print",
  "printc",
  "alloc",
  "getbyte",
  "setbyte",
  "loadi",
  "setarg",
  "getarg",
  "call",
  "ncall",
  "debug",
  "debuga",
  "module",
  "get",
  "set",
};



#endif // VM_BYTECODES
