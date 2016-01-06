#ifndef OBJECT
#define OBJECT

#include "value.h"

#define VT_NULL     0
#define VT_BYTES    1
#define VT_VALUES   2
#define VT_STRING   3
#define VT_FUN      4
#define VT_NFUN     5
#define VT_MODULE   6


typedef struct {
  short size;
  short vtable;
  Value data[];
} Object; // Heap Object

#endif // OBJECT
