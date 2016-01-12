# Lang

Un pseudolenguaje que usaré para explicar como implementar otros lenguajes.
Es basado en Python, C y C++. Tiene tipos y no soporta herencia, solo tiene
bases muy simples, y un diccionario (sin implementación).

Creo este pseudolenguaje porque necesito una forma estandar de explicar una
implementación. Si uso una sintaxis arbitraria cada vez que escriba un
algoritmo, la sintaxis va a cambiar con cada uno que escriba. Pero tampoco
puedo usar un lenguaje real porque tienen mucha complejidad de la que tengo
que estar pendiente al escribirlos, más de la que necesito.
Las opciones eran Python o C.

### Clases e instancias

El pseudocódigo:

    class C
      int a
      var b
      C c2
      int f (y)
        x = y
        a = a+x
        return a
      var g ()
        return b
      var h ()
        return f(1)
    c = C(a=2)
    c.b = null
    c.f(2)
    c.c = C()

compila a Casi C:

    struct C {
      int a;
      void *b;
      C *c2;
    }
    int C_f (C *self, int y) {
      int x = y;
      self->a = self->a + x;
      return self->a;
    }
    void *C_g (C *self) {
      return self->b;
    }
    void *C_h (C *self) {
      return &C_f(self, 1);
    }
    C *c = malloc(C);
    c->a = 2;
    c->b = NULL;
    C_f(c, 2);
    c->b = C_h(c);
    c->c = maloc(C);

las clases pueden tener constructores que reciben argumentos, si uno de los
argumentos no se usa en el constructor y hay un campo de la instancia con ese
nombre, se pone automáticamente y es obligatorio:

    class C
      string name
      int x
      int y
      init (name, int z)
        x = z + 1
    c = C(name="lol",z=2,y=5)
    cx = C(z=3) # No es legal, no tiene name

compila a:

    struct C {
      string name;
      int x, y, z;
    }
    void *C_init (C *self, string xname, int z) {
      c->name = xname; // Asignar campos siempre es de primero
      c->x = z + 1;
    }
    C *c = malloc(C)
    c->y = 5; // Asignar campos es antes del constructor
    C_init(c, "lol", 2);

### Diccionarios y Arrays

el pseudocódigo:
  
    d = {a=1, b=2}
    d["c"] = 3
    key = "f"
    d[key] = d["b"]
    ikey = d["a"]
    a = [1,2,3]
    a[0] = 4
    a[ikey] = 5
    lol = a[2]

compila a Casi C, Suponiendo que tenemos una cabecera con una implementación
mágica:

    struct Dict { ... } // Magia!!
    Dict *new_dict ();  // Hace malloc por nosotros e inicializa.
    void *dict_get (Dict *self, char *key);
    void sict_set (Dict *self, char *key, void *value);
    /* --- */
    struct Arr { ... } // Whoo!!
    struct *new_arr (int size); // Los arrays son de tamaño fijo.
    void *arr_get (Arr *self, int i);
    void arr_set (Arr *self, int i, void *val);

Entonces:

    Dict *d = new_dict();
    dict_set(d, "a", &1); dict_set(d, "b", &2);
    dict_set(d, "c", &3);
    dict_set(d, "d", &4);
    char *key = "f";
    dict_set(d, key, dict_get(d, "b") );
    void *ikey = dict_get(d, "a");
    // ikey en realidad es de tipo "int*"
    Arr *a = new_arr(3);
    arr_set(a, 0, &1);
    arr_set(a, 1, &2);
    arr_set(a, 2, &3);
    arr_set(a, 0, &4)
    arr_set(a, &ikey, &5); // Hay que dereferenciar ikey porque es de tipo void*
    void *lol = arr_get(a, 2); // lol en realidad es de tipo "int*"

El nombre de los tipos son _dict_ para el array asociativo, y _arr_ para el
array, en minúsculas para no confundirlos con las clases del usuario, es decir:

    dict d = {}
    arr a = []

Los tipos van en minúscula: int, float, string, arr, dict, var
Las clases van camelcased: Foo, Bar, FooBar, CamelCase
Las variables snakecased: foo, bar, foo_bar, snake_case

Hay tres variables especiales:
this: la instancia que ejecuta el método actual.
super: una versión de this cuya clase es la superclase.
null: indica la ausencia de una variable.

Los tipos de Lang y su equivalente en C:
int => int
float => float
string => char*
arr => Arr
dict => Dict
var => void*



