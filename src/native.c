
#include "native.h"

#define NUM_OF_FUNC 128
#define NULL 0

Nfunction stack[NUM_OF_FUNC];
int stack_top = 0;

Value register_function (Nfunction fun) {
  //if (stack_top >= NUM_OF_FUNC) return Null_Value;
  stack[stack_top] = fun;
  Value val = {.tipo = T_NFUN, .v.i = stack_top};
  stack_top++;
  return val;
}

Nfunction get_function (Value val) {
  if (val.tipo != T_NFUN) {return NULL;}
  int i = val.v.i;
  if (i >= stack_top) {return NULL;}
  return stack[i];
}
