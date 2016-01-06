#ifndef VM_NATIVE
#define VM_NATIVE

#include "value.h"
#include "machine.h"

typedef void (*Nfunction) (Machine *);

Value register_function (Nfunction);
Nfunction get_function (Value);


#endif // VM_NATIVE
