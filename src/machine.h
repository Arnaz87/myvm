#ifndef VM_MACHINE
#define VM_MACHINE

#include "value.h"
#include "heap.h"

#define NULL 0

typedef struct {
  int reg_size;   // Tamaño del registro asignado a este Estado
  Value *reg;     // Sección del registro asignado a este Estado
  char *program;  // Puntero al código del programa
  int pc;         // Program Counter, instrucción actual para ejecutar
} Machine_state;

static const Machine_state empty_machine_state = {
  .reg_size = 0, .reg = NULL, .program = NULL, .pc = 0
};

typedef struct {
  int do_stop;      // Estado de la máquina: 0 corriendo, 1 terminado, 2 error
  int reg_size;     // Tamaño del registro
  int reg_top;
  Value *reg;       // Registro completo para la máquina
  int args_size;    // Tamaño del stack de argumentos [32]
  Value *args;      // Stack de argumentos
  Heap *heap;       // Heap de la máquina
  int state_size;   // Tamaño del stack de estados
  int state_top;    // Primer estado libre
  Machine_state *state_stack; // Stack de estados, no contiene el estado actual
  Machine_state state;        // Estado actual
} Machine;

void alloc_machine (Machine *);
void free_machine (Machine *);

void push_machine_state (Machine *);
void pop_machine_state (Machine *);

void alloc_machine_state_reg (Machine *, int nsize);
void free_machine_state_reg (Machine *);

void machine_set_program (Machine *, int *npro);
void machine_load_function (Machine *machine, Value pro);
void machine_terminate_function (Machine *machine);

#endif // VM_MACHINE
