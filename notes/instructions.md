# Instruction list

-- Arithmetic & Logic
iadd, fadd, isub, fsub, imult, fmult, idiv, fdiv, ineg, fneg, (10)
imod, inot, iand, ior, ixor, ileft, iright, (7)
ieq, feq, ineq, fneq, ilt, flt, ilteq, flteq, (8)
bnot, band, bor, bxor, beq, bneq, (6)
itof, ftoi, btoi (3)
(34)

-- Registers
mov, null, loadk, copy, typeset
(5)

-- Flow
jump, jumpif, jumpifn, unsafe
(4)

-- Functions
call, msg, tailcall, tailmsg, ret
(5)

-- Heap
new, getbyte, setbyte, getvalue, setvalue, getvtable, setvtable, getuvalue, setuvalue
(9)

-- Total
57

## Memory Manipulation

Register manipulation:
  mov, null, loadk

Load to register:


## Arithmetic & Logic

Integer arithmetic (2 params):
  iadd, isub, imult, idiv, imod

Integer bit (2 param):
  ileft, iright, iand, ior, ixor

Integer arithmetic & bit (1 param):
  ineg, inot

Float arithmetic (2 & 1 params):
  fadd, fsub, fmult, fdiv, fneg

Integer & Float logic:
  ieq, ilt, ilteq, igtz,
  feq, flt, flteq, fgtz

Number conversion:
  itof, ftoi

Explanation:
  xadd: a = b + c
  xsub: a = b - c
  xmult: a = b * c
  xdiv: a = b / c
  xneg: a = -b
  ileft: a = b << c
  iright: a = b >> c
  iand: a = b & c
  ior: a = b | c
  ixor: a = b ^ c
  inot: a = !b
  xeq: a = (b == c)
  xlt: a = b < c
  xlteq: a = (b <= c)
  xgtz: a = b > 0
  itof: a = (float)b
  ftoi: a = (int)b


