#include "heap.h"

Heap * new_heap (int size) {
  Heap *heap = (Heap*)malloc(sizeof(Heap));
  heap->size  = size;
  heap->data  = (char*)malloc(size * sizeof(char));
  heap->top   = 0;
  return heap;
}

void delete_heap (Heap *heap) {
  int size = heap->size;
  free(heap->data);
  free(heap);
}

int heap_alloc (Heap *heap, int size) {
  int pos = heap->top;
  heap->top += size;
  return pos;
}

void heap_free (Heap *heap, int pos) {
  return;
}

char heap_get (Heap *heap, int pos) {
  return heap->data[pos];
}

void heap_set (Heap *heap, int pos, char value) {
  heap->data[pos] = value;
}

Value heap_alloc_bytes (Heap *heap, int size) {
  int ref = heap_alloc(heap, size + sizeof(Object));
  Value val = { .tipo = T_OBJ, .v.i = ref};
  return val;
}

Value heap_alloc_object (Heap *heap, int size) {
  return heap_alloc_bytes( heap, sizeof(Value)*size );
}

Object *heap_get_object(Heap *heap, Value ref) {
  Object *obj = (Object*)(heap->data + value_ref(ref));
  return obj;
}

Value heap_object_get (Heap *heap, Value ref, int pos) {
  Object *obj = heap_get_object(heap, ref);
  return obj->data[pos];
}

void heap_object_set (Heap *heap, Value ref, int pos, Value val) {
  Object *obj = heap_get_object(heap, ref);
  obj->data[pos] = val;
}

char* heap_object_byte_array (Heap *heap, Value ref) {
  Object *obj = heap_get_object(heap, ref);
  return (char*)obj->data;
}

void heap_object_set_vtable (Heap *heap, Value ref, int vt) {
  Object *obj = heap_get_object(heap, ref);
  obj->vtable = (short)vt;
}

int heap_object_get_vtable (Heap *heap, Value ref) {
  Object *obj = heap_get_object(heap, ref);
  return (int)obj->vtable;
}
