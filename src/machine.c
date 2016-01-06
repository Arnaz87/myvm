
#include "machine.h"

#define NULL 0

#define ERROR_MACHINE(X) {printf("[Machine Error: "X"]");machine->do_stop=2;return;}

void alloc_machine (Machine *machine) {
  machine->reg = malloc(sizeof(Value) * machine->reg_size);
  machine->args = malloc(sizeof(Value) * machine->args_size);
  machine->state_stack = malloc(sizeof(Machine_state) * machine->state_size);
  machine->state_top = 0;
  machine->state = empty_machine_state;
}

void free_machine (Machine *machine) {
  free(machine->reg);
  free(machine->args);
  free(machine->state_stack);
}

void push_machine_state(Machine *machine) {
  if (machine->state_top >= machine->state_size) ERROR_MACHINE("State stack overflow!");
  machine->state_stack[machine->state_top] = machine->state;
  machine->state_top++;
  machine->state = empty_machine_state;
}

void pop_machine_state(Machine *machine) {
  if (machine->state_top <= 0) ERROR_MACHINE("State stack Already Empty!");
  machine->state_top--;
  machine->state = machine->state_stack[machine->state_top];
}

// Debe llamarse antes de pop_state o push_state
void free_machine_state_reg(Machine *machine) {
  if (!machine->state.reg) return;
  machine->reg_top -= machine->state.reg_size;
  machine->state.reg_size = 0;
  machine->state.reg = NULL;
}

void alloc_machine_state_reg(Machine *machine, int nsize) {
  if (nsize < 1) ERROR_MACHINE("Cannot allocate an empty register!");
  free_machine_state_reg(machine);
  if (machine->reg_top + nsize > machine->reg_size) ERROR_MACHINE("Register Stack Overflow!");
  machine->state.reg = &(machine->reg[machine->reg_top]);
  machine->state.reg_size = nsize;
  machine->reg_top += nsize;
}

void machine_set_program (Machine *machine, int *npro) {
  machine->state.program = npro;
  machine->state.pc = 0;
}

void machine_load_function (Machine *machine, Value pro) {
  //printf("[Loading Function %d...]", pro.v.i);
  if (machine->state.program != NULL) {
    push_machine_state(machine);
  }
  alloc_machine_state_reg(machine, 64);
  int *ipro = (int *) heap_object_byte_array(machine->heap, pro);
  //printf("[Program to load: %p, starts with: %d]", ipro, ipro[0]);
  machine_set_program(machine, ipro);
  //printf("[Program loaded: %p, pc: %d]", machine->state.program, machine->state.pc);
  //printf("[Loaded function, reg: %d, args: %d]", machine->state.reg - machine->reg, machine->args - machine->reg);
}

void machine_terminate_function (Machine *machine) {
  //printf("[Ending Function...]");
  if (machine->state_top <= 0) {
    machine->do_stop = 1;
    return;
  }
  free_machine_state_reg(machine);
  pop_machine_state(machine);
}
