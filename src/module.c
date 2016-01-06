#include "module.h"

#define NUM_OF_MODULES 128

typedef struct {
  char *key;
  Value value;
} Entry;

Entry modules[NUM_OF_MODULES];
int modules_top = 0;

Value find_module (char *query) {
  //printf("  Searching for module\t\"%s\":\n", query);
  int i = 0;
  for (i = 0; i < modules_top; i++) {
    Entry current = modules[i];
    //printf("  Current module:\t\"%s\"\n", current.key);
    // strcmp devuelve 0 si son iguales, porque devuelve 1 si es mayor y -1 si es menor
    if (!strcmp(query, current.key)) {
      //printf("  Matched Module!\n");
      return current.value;
    }
  }
  //printf("  Module not found.\n");
  return Null_Value;
}

void add_module (char *nkey, Value nval) {
  if (modules_top >= NUM_OF_MODULES) return;
  modules[modules_top] = (Entry){ .key = nkey, .value = nval};
  modules_top++;
}

Value find_module_with_object(Heap *heap, Value query_val) {
  char *str = heap_object_byte_array(heap, query_val);
  return find_module(str);
}


