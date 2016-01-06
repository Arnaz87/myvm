
#include <stdio.h>

#include "execute.h"
#include "heap.h"
#include "native.h"
#include "module.h"

#include "bytecodes.h"

#define NULL 0
#define ADVANCE(X) vm_pc+=(X)+1;break;
#define DEBUG(X, ...) printf("[PC %d:"X"]", vm_pc, ##__VA_ARGS__);
#define WARN(X, ...) printf("[WARN: "X"]", ##__VA_ARGS__);

void machine_exec (Machine *machine) {
  //printf("[Run instruction %d]", machine->state.pc);
  if (machine->state.program == NULL) {
    //printf("[Stopping: Program is null]");
    machine->do_stop = 1;
    return;
  }
  Value *vm_reg = machine->state.reg;
  Value *vm_args = machine->args;
  Heap *heap = machine->heap;
  int vm_pc = machine->state.pc;
  int *code = machine->state.program;
  enum instruction inst = code[vm_pc];
  int a = code[vm_pc + 1],
      b = code[vm_pc + 2],
      c = code[vm_pc + 3];
  //printf("Correr Instrucción %d: %d!\n", vm_pc, inst);
  Value func = Null_Value;
  Nfunction nfun = NULL;
  switch (inst) {
    case add:
      vm_reg[a].v.i = vm_reg[b].v.i + vm_reg[c].v.i;
      ADVANCE(3)
    case mult:
      vm_reg[a].v.i = vm_reg[b].v.i * vm_reg[c].v.i;
      ADVANCE(3)
    case div:
      vm_reg[a].v.i = vm_reg[b].v.i / vm_reg[c].v.i;
      ADVANCE(3)
    case neg:
      vm_reg[a].v.i = -vm_reg[b].v.i;
      ADVANCE(3)
    case eq:
      vm_reg[a].v.i = vm_reg[b].v.i == vm_reg[c].v.i;
      ADVANCE(3)
    case lt:
      vm_reg[a].v.i = vm_reg[b].v.i < vm_reg[c].v.i;
      ADVANCE(3)
    case lteq:
      vm_reg[a].v.i = vm_reg[b].v.i <= vm_reg[c].v.i;
      ADVANCE(3)
    case jump:
      vm_pc = a;
      ADVANCE(-1);
    case jumpif:
      if (vm_reg[b].v.i) {vm_pc = a; return -1;}
      ADVANCE(2)
    case print:
      printf("%d", vm_reg[a].v.i);
      ADVANCE(1)
    case printc:
      putchar(vm_reg[a].v.i);
      ADVANCE(1)
    case alloc:
      vm_reg[a] = heap_alloc_object(heap, b);
      ADVANCE(2)
    case getbyte:
      vm_reg[a] = heap_object_get(heap, vm_reg[b], c);
      ADVANCE(3)
    case setbyte:
      heap_object_set(heap, vm_reg[b], c, vm_reg[a]);
      ADVANCE(3)
    case loadi:
      vm_reg[a]= (Value) {.tipo = T_INT, .v.i = b};
      //DEBUG("load %d to reg[%d] = %d", b, a, vm_reg[a].v.i,0)
      ADVANCE(2)
    case setarg:
      vm_args[a] = vm_reg[b];
      //DEBUG("reg(%d : %d) -> arg(%d : %d)", b,vm_reg[b].v.i, a, vm_args[a].v.i)
      ADVANCE(2)
    case getarg:
      vm_reg[a] = vm_args[b];
      ADVANCE(2)
    case ncall:
      //DEBUG("ncall instruction");
      //DEBUG("call native function in reg[%d]",a)
      nfun = get_function(vm_reg[a]);
      //DEBUG("nfun = %p", nfun);
      //DEBUG("call native reg[%d], nfun: %p", a, nfun)
      ADVANCE(1)
    case end:
      //DEBUG("Reached Function End");
      machine_terminate_function(machine);
      return;
    case call:
      //DEBUG("inst call, reg: %d", a)
      func = vm_reg[a];
      ADVANCE(1)
    case debug:
      printf("[REG %d: %d (%s)]\n", a, vm_reg[a].v.i, value_tipo_name(vm_reg[a]));
      ADVANCE(1)
    case debuga:
      DEBUG("Arg: %p", &(vm_args[a]));
      printf("[ARG %d: %d (%s)]\n", a, vm_args[a].v.i, value_tipo_name(vm_args[a]));
      ADVANCE(1)
    case module:
      vm_reg[a] = find_module_with_object(machine->heap, vm_reg[b]);
      ADVANCE(2)
    default:
      printf("[ERROR: La instrucción %d no existe! (pc: %d)]", inst, vm_pc);
      machine->do_stop = 2;
      return;
  }
  machine->state.pc = vm_pc;
  if (func.tipo != T_NULL) {
    //DEBUG("Calling!")
    machine_load_function(machine, func);
  }
  if (nfun != NULL) {
    //DEBUG("run native function");
    nfun(machine);
  }
  return;
}
