#ifndef VM_MODULE
#define VM_MODULE

#include "value.h"
#include "object.h"
#include "heap.h"

Value find_module (char *query);
void add_module (char *nkey, Value nval);

Value find_module_with_object(Heap *heap, Value query_val);

#endif // VM_MODULE
