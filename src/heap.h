#ifndef VM_HEAP
#define VM_HEAP

#include "value.h"
#include "object.h"

typedef struct {
  int pos;
  int size;
} Free;

typedef struct {
  int size;   // Tamaño del heap en bytes
  char *data; // Puntero al heap
  //*Free free; // Datos de implementación, como el freelist, o el top del stack, etc.
  int top;    // Top del stack
} Heap;

Heap *new_heap (int size);

void delete_heap (Heap *heap);
/*
int heap_alloc (Heap *heap, int size);  // Returns position index of the object

void heap_free (Heap *heap, int pos);   // Receives position index of the object

char heap_get (Heap *heap, int pos);

void heap_set (Heap *heap, int pos, char value);
*/
Value heap_alloc_object (Heap *heap, int size);

Object *heap_get_object (Heap *heap, Value ref);

Value heap_alloc_bytes (Heap *heap, int size);

Value heap_object_get (Heap *heap, Value ref, int pos);

void heap_object_set (Heap *heap, Value ref, int pos, Value val);

char* heap_object_byte_array (Heap *heap, Value ref);

void heap_object_set_vtable (Heap *heap, Value ref, int vt);
int heap_object_get_vtable (Heap *heap, Value ref);

#endif // VM_HEAP
