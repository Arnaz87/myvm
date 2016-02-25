# Polimorfismo

Nota: Esta nota está basada en lo que he leído hasta ahora de este artículo http://www.cs.ox.ac.uk/jeremy.gibbons/publications/dgp.pdf

Existen varios tipos de polimorfismo que diferentes lenguajes implementan. Voy a hacer aquí un breve resumen y una comparasión de los que he visto.

Obvio estoy basándome en conocimiento que es bien sabido y he aprendido, nada lo estoy inventando, pero estoy organizando y nombrando los conceptos diferente a lo usual, para poder explicar más fácilmente mis ideas y conclusiones.

## Introducción

### Uso de parámetros

Una rutina describe una acción que el programa puede realizar, y una clase describe información de la que el programa tiene conocimiento. Voy a llamar
__Unidad__ a ambos conceptos, e "_invocar_ una unidad" significa ejecutar una rutina o instanciar una clase.

Muy frecuentemente, existen unidades que se comportan de un modo muy parecido con diferencias muy pequeñas. Por esta razón, los lenguajes tienen mecanismos para describirlas de un modo general, marcando solo las diferencias en cada uso específico. Estas diferencias, que se le hacen saber la unidad en cuestion, son los
__Parámetros__.

El tipo más común de parámetros son los valores, que son los que recibe una rutina para trabajar directamente con ellos. Los valores se crean y se trabaja con ellos en plena ejecución de un programa, porque el programa puede crearlos en base a valores anteriores, y algunos son los parámetros del programa en sí, que cambian cada vez que se ejecuta, por lo que no se pueden predecir antes de ejecutarse.

Esto no se considera polimorfismo porque es la manera básica en que se escriben programas, pero lo que quería ilustrar era el concepto de parámetros, porque es la manera en que se describe el polimorfismo.

### Necesidad del Polimorfismo

Un valor siempre necesita una clase para que el programa pueda saber cómo interpretarlo, porque al final un valor es simplemente un número en la memoria. Si un valor interpreta erroneamente, se pueden perder datos y todo el programa puede fallar. Para que eso no pase, el lenguaje fuerza al programa a siempre interpretar el mismo valor con la misma clase que tuvo desde un principio (Hay lenguajes que no lo hacen, se dice que son "_inseguros_").

Un lenguaje de tipado estático impone la seguridad haciendo que cada parámetro de una unidad exija una sola clase específica, y no permite invocarla con una clase diferente. Este comportamiento es a veces inconveniente cuando una unidad se comporta del mismo modo con cualquier clase, por ejemplo con una rutina para ordenar, o una clase para listas.

Este problema se soluciona dándole al lenguaje la capacidad de permitir el uso de valores de diferentes clases en el mismo lugar. Esta capacidad se llama
__Polimorfismo__. Hay muchas maneras de implementar polimorfismo, en nota trato de explicar y organizar los mecanismos de polimorfismo que conozco.

## Tipado Dinámico

Los valores siempre son creados con una clase, y el lenguaje debe asegurarse de saber siempre la clase de ese valor para ser seguro. Una forma de hacerlo es, al compilar, hacerle seguimiento al valor por todas las variables por las que pasa y en todos los lugares en el programa en donde aparece. Este es el mecanismo que usan los lenguajes de tipado estático.

En otro método, el lenguaje no le hace seguimiento a los valores y las unidades pueden recibir y devolver valores con cualquier clase. En cambio, la clase está codificada dentro del mismo valor. De ese modo solo hace falta revisar qué clase tiene un valor y se puede hacer en cualquier punto del programa. Este es el mecanismo que usan los lenguajes de tipado dinámico.

Este mecanismo es lo que se llama __Tipado Dinámico__. En muchos lenguajes estáticos, esta característica está disponible, pero no es por defecto.

### C/C++

Se puede usar el tipo `void*`, pero no funciona con primitivos, solo con punteros. En realidad esto no es tipado dinámico, la variable simplemente no tiene tipo, las variables con `void*` pierden por completo su tipo y no puede ser recuperado, el programador tiene que saber el tipo de la variable de antemano.

Se puede aprovechar que `void*` no restringe el tipo de las variables, y usar algo como `struct {int type; void *value}` para guardar el tipo junto con el valor, pero elprogramador debe ser cuidadoso manejando el tipo de value.

```c++
void *a;  // Esta variable acepta punteros a lo que sea.
a = &((float) 3.0);
a = &((int) 3);
int j = *a;
float f = *a; // Ups!! No falla inmediatamente, pero el error silenciosamente se va infectando en todo el programa, y se pondrá muy feo!

#define INT_T = 0
#define FLOAT_T = 1
struct {int type; void *value;} dyn;
void set_int (int *x) {dyn.type = INT_T; dyn.value = x;}
void get_int () {if (syn.type == INT_T) {return dyn.value;} else {ERROR;}}
void set_float (float *x) {dyn.type = FLOAT_T; dyn.value = x;}
set_float(3.0);
int *ip = get_int(); // ERROR! Falla automáticamente, así que es fácil de detectar y corregir.
// El ejemplo con void* es mucho más sencillo de escribir, pero es
// mucho más peligroso.

```

### Java

En java, se puede aprovechar el _Polimorfismo inclusivo_ y el hecho de que todos los objetos descienden de la clase _Object_, y simular tipado dinámico. Lo único es que no funciona con primitivos porque no son objetos, pero java tiene Autoboxing que aligera el progblema (automáticamente convertir primitivos a cajas cuando hace falta un objeto).

```java
Object a;
a = "Ola ke ase!"
a = new Gato();
a = new Int(3);
a = 3; // Lo mismo de arriba pero con Autoboxing.
Int i = a;   // Sip.
Float f = a; // Nope.
```

### Scala

Técnicamente, funciona igual que java. Usa la clase _Any_ en vez de _Object_. Y en Scala no hay primitivos, todo es un objeto, así que no hay autoboxing para números y otros tipos básicos (En realidad la implementación si lo usa, pero no existe en el lenguaje).

```scala
var a:Any = 3
a = new Carro
a = (4.0: Float)
var c:Carro = a.asInstanceOf[Carro] // Runtime Error
```

### Haskell

Haskell no tiene tipado dinámico, lo más parecido es polimorfismo paramétrico.

## Polimorfismo Paramétrico

Tradicionalmente, un lenguaje de tipado estático impone la seguridad haciendo que cada parámetro de una unidad exija una sola clase específica, y no permite invocarla con una clase diferente. Algunos lenguajes ofrecen la posibilidad de pasar las propias clases de los parametros como parámetros (aunque la mayoría de las veces son otro tipo de parámetros).

A esto se le dice __Polimorfismo Paramétrico__.

### C++

Los templates de C++ son unidades que pueden recibir tipos (clases) como parámetros, y cada vez que se usan, compila una nueva copia de esa unidad usando esos tipos. Es básicamente escribir la misma unidad de nuevo, exactamente igual, pero usando diferentes tipos.

Una desventaja con los templates es que literalmente crean más código, y también que las unidades instanciadas, desde la perspectiva del compilador, no son la misma ni tienen relación entre ellas (necesariamente), aún si son generadas desde el mismo template solo con diferentes parámetros.

```c++
// No conozco bien la sintaxis... D:
template <T>
class Box {
  T value;
  void set(T x) { value = x };
  T get () { return value; };
};
```

Los templates son un poco más complejos que esto, pero para mis motivos esta explicación es suficiente.

### Java

Los genéricos en java son azúcar sintáctico. Dentro de un genérico, en donde se usan clases parámetros, en realidad java usa `Objeto`, y al compilar automáticamente hace _Downcasting_. Simplemente ahorran algunas letras al programador e imponen seguridad. La principal desventaja de esto frente a otras implementaciones "reales", es que la máquina virtual no tiene idea de qué clases usa un genérico, y significa que se puede engañar a un genérico para que acepte clases que no debería. Pero no es tan grave.

```java
Stack<Int> s = new Stack<Int>()
Int i = 4;
s.push(i);
i = s.pop();
s.push(new Double(4.0)); // Runtime Error
// Es azúcar sintáctico (con chequeo de tipos incluido) para:
Stack ss = new Stack() // Guarda Object
ss.push(i); // Automáticamente upcasted a Object
i = (Int)ss.pop();
ss.push(new Double(4.0)); // Ups, No falla!
```

### Scala

Scala es un lenguaje de la JVM, así que sufre básicamente las mismas limitaciones que Java y tiene que implementarlo en la sintaxis. Pero a difeencia de Java, no es simple azúcar sintáctico. En Scala los genéricos influyeron la gramática del lenguaje desde un principio.

## Polimorfismo inclusivo

A veces, comúnmente, las clases pueden ser organizadas en categorías, sea por comportamiento similar o porque naturalmente son de una misma familia, por ejemplo, un gato y un perro son muy distintos, pero ambos son animales. Algunos lenguajes permiten que una unidad espere una categoría, sin importar el tipo específico siempre que sea parte de la categoría. Siguiendo el ejemplo, una unidad podría esperar un animal, aceptando gatos y perros indiscriminadamente.

La capacidad de categorizar clases no es polimorfismo, pero la capacidad de aceptar cualquier clase de una categoría indiscriminadamente, sí lo es, y se llama __Polimorfismo inclusivo__.

## Downcasting

En los lenguajes con polimorfismo inclusivo, una variable que espera una categoría no sabe la clase de sus valores, solo que son parte de esa categoría. __Downcasting__ es la capacidad en un lenguaje de recuperar la clase original de un valor del que solo se sabe su categoría.

La mayoría de las veces, hacer esto requiere características de tipado dinámico, es decir, guardar la clase junto con el valor, porque una vez que un valor se interpreta como una categoría, el lenguaje no puede seguir haciéndole seguimiento a la clase original y se pierde.

En algunos lenguajes (C++), downcasting es más bien interpretar un objeto con una clase "categórica" como cualquier clase dentro de esa categoría, no necesariamente la original, lo que lo hace muy peligroso de usar.