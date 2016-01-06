#include <stdio.h>
#include <string.h>

#include "value.h"
#include "object.h"
#include "heap.h"
#include "module.h"
#include "native.h"
#include "machine.h"
#include "bytecodes.h"

void print_int (Machine *machine) {
  int x = machine->args[0].v.i;
  printf("%d", x);
}

void print_char (Machine *machine) {
  printf("%c", machine->args[0].v.c);
}

void debug_val (Machine *machine) {
  printf("[DBG:%d]", machine->args[0].v.i);
}

void print_string (Machine *machine) {
  char *str = heap_object_byte_array(machine->heap, machine->args[0]);
  //printf("[String %p at heap %d, char[4]:%c]", str, value_ref(vm_args[0]), str[4]);
  puts(str);
}

Value alloc_string (char *str, Heap *heap) {
  size_t len = strlen(str);
  Value obj = heap_alloc_bytes(heap, len+5);
  heap_object_set_vtable(heap, obj, VT_STRING);
  //printf("\nObject at: %p", heap->data + value_ref(obj));
  char *data = heap_object_byte_array(heap, obj);
  strcpy(data, str);
  return obj;
}

// pro es un puntero a las instrucciones, len es el tamaño en bytes, no el numero de instruciones
Value alloc_func (enum instruction *pro, size_t len, Heap *heap) {
  //size_t len = pro_len * sizeof(*pro);
  Value obj = heap_alloc_bytes(heap, len+5);
  heap_object_set_vtable(heap, obj, VT_FUN);
  char *data = heap_object_byte_array(heap, obj);
  char *pro_bytes = (char *)pro;
  memcpy(data, pro_bytes, len);
  return obj;
}

enum instruction add_two[] = {
  loadi, 5, 2,    // R5 = 2
  getarg, 0, 0,   // R0 = Arg(0)
  add, 0, 5, 0,   // R5 = R0 + R5
  setarg, 0, 0,   // Arg(0) = R0 (Return)
  end
};

enum instruction print_stuff[] = {
  loadi, 10, ' ',
  loadi, 11, ':',
  loadi, 12, '\n',

  getarg, 20, 10, // R10 = Arg(10): print_int
  getarg, 21, 11, // R11 = Arg(11): print_char
  getarg, 1, 0,   // R1 = Arg(0): argument

  setarg, 0, 1,
  ncall, 21,      // print_char(R1): argument
  setarg, 0, 11,
  ncall, 21,      // print_char(':')
  setarg, 0, 1,
  ncall, 20,      // print_int(R1): argument
  setarg, 0, 12,
  ncall, 21,      // print_char('\n')

  setarg, 0, 1,  // return(R1): argument
  end
};

enum instruction my_program[] = {
  loadi, 2, 1,      // R2 = 1

  setarg, 10, 20,   // Arg(10) = print_int
  setarg, 11, 21,   // Arg(11) = print_char

  alloc, 3, 5,      // R3 = new Object(size: 5)
  add, 4, 1, 2,     // R4 = 'A' + 1 (R1 + R2)
  setbyte, 4, 3, 0, // R3[0] = B (R4)
  add, 4, 4, 2,     // R4 = 'B' + 1 (R4 + R2)
  setbyte, 4, 3, 1, // R3[1] = 'C' (R4)

  getbyte, 5, 3, 0, // R5 = R3[0]
  setarg, 0, 5,
  call, 26,         // print_stuff('B'): R5

  setarg, 0, 5,
  call, 25,         // add_two(R5) 'B'
  call, 26,         // print_stuff(R5) 'B'+2

  getbyte, 5, 3, 1, // R5 = R3[1]
  setarg, 0, 5,
  call, 26,         // print_stuff('C'): R5

  module, 19, 23,   // R19 = module(R23) : "print_string"
  //debug, 20,
  setarg, 0, 15,
  ncall, 19,         // print_string(R15)
  end
};

int main () {
  Heap *heap = new_heap(1024);

  Machine machine;
  machine.reg_size = 128;
  machine.args_size = 32;
  machine.state_size = 8;
  machine.heap = heap;

  alloc_machine(&machine);

  //alloc_machine_state_reg(&machine, 16);
  //machine_set_program(&machine, my_program);
  printf("Program size: %d\n", sizeof(my_program));
  Value myfun = alloc_func(my_program, sizeof(my_program), heap);

  printf("Heap size: %d, used: %d", heap->size, heap->top);

  machine_load_function(&machine, myfun);

  machine.do_stop = 0;

  Value *vm_reg = machine.reg;

  vm_reg[0] = (Value) { .tipo = T_INT, .v.i = 'a'};
  vm_reg[1] = (Value) { .tipo = T_INT, .v.i = 'A'};

  vm_reg[20] = (Value)register_function(&print_int);
  vm_reg[21] = (Value)register_function(&print_char);
  vm_reg[22] = (Value)register_function(&print_string);
  vm_reg[23] = alloc_string("print_string", heap);

  add_module("print_string", register_function(&print_string));

  //vm_reg[23] = (Value)register_function(&debug_val);

  vm_reg[25] = alloc_func(add_two, sizeof(add_two), heap);
  vm_reg[26] = alloc_func(print_stuff, sizeof(print_stuff), heap);

  vm_reg[15] = alloc_string("Maquina virtual!", heap);



  printf("Running Program:\n-----\n");
  run_program(&machine);
  printf("\n-----\nProgram Ended!\n");
  if (machine.do_stop == 2) {
    printf("Program finished with Errors!");
  }
  return 0;
}

int run_program (Machine *machine) {
  while (machine->do_stop == 0) {
    machine_exec(machine);
  }
}
