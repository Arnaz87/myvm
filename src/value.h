#ifndef VM_VALUE
#define VM_VALUE

// Tipos, comienzan con T_
#define T_NULL  0
#define T_INT   1
#define T_FLOAT 2
#define T_CHAR  3

#define T_OBJ   4
#define T_FUN   5 // Programa interpretado

#define T_NFUN  6 // Función nativa

static const char *tipo_strings[] = {
  [T_NULL] = "null",
  [T_INT] = "int",
  [T_FLOAT] = "float",
  [T_CHAR] = "char",
  [T_OBJ] = "obj",
  [T_FUN] = "fun",
  [T_NFUN] = "nfun"
};

typedef struct {
  char tipo;
  union {
    int i;
    float f;
    char c;
  } v;
} Value;

static inline int value_int (Value v) {
  if (v.tipo == T_INT) {
    return v.v.i;
  }
  printf("[Error: Valor no es de tipo entero.]");
  return 0;
}

static inline int value_ref (Value v) {
  if (v.tipo == T_OBJ) {
    return v.v.i;
  }
  printf("[Error: Valor no es de tipo objeto.]");
  return 0;
}

static inline char * value_tipo_name (Value v) {
  int t = v.tipo;
  int sz = sizeof(tipo_strings) / sizeof(tipo_strings[0]);
  if (t >= sz || t < 0) {
    return "(unknown)";
  }
  return tipo_strings[t];
}

static Value Null_Value = { .tipo = T_NULL, .v.i = 0 };

/*
#undef T_NULL
#undef T_INT
#undef T_FLOAT
#undef T_CHAR
#undef T_OBJ
#undef T_NFUN
*/

#endif // VM_VALUE
