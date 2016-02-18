# Notas

Aquí voy guardando todas las notas e ideas a medida que se me vayan ocurriendo, en vez de editar los archivos de texto principales, así puedo tener un registro de cómo evolucionan mis ideas.

Para Sublime: Instalar el paquete __InsertDate__y agregar esto en "Preferences->Key Bindings - User":

    { "keys": ["ctrl+f5", "s"],
      "command": "insert_date",
      "args": {"format": "[%Y-%m-%d %H:%M]"}
    }

Con esto, el atajo `(ctrl+f5) + s` imprime la fecha

Hay que tener en cuenta que el desarrollo de este lenguaje no es por el lenguaje en sí, es para la máquina virtual, todos los conceptos y abstracciones que tiene el lenguaje son abstracciones que la propia máquina virtual implementa.

## [2016-02-13 15:03] Algunas Características

- Basada en Objetos
- Interfaces
- Clases Simples, sin herencia
- Manejo Automático de Memoria
- Manejo Manual de Memoria
- Tipado Estático
- Tipado Dinámico
- Funciones como Objetos
- Clases como Objetos
- Sistema de Módulos

No sé de Concurrencia. El único concepto de concurrencia que conozco es el _Thread_, no sé de _Corrutinas_ ni del _Modelo de actores_ ni nada así.

La sintaxis tiene que ser simple, parecida a la de C, pero metiéndole los conceptos abstractos de la Máquina (pero no voy a dejar que se vuelva un Frankenstain como C++).

## [2016-02-14 01:48] Primera idea de la Sintaxis

Una pequeña muestra de la sintaxis del lenguaje como la tengo hasta ahora

``` c
module Factorial factorial, factorialr;
inline int factorial (int x) {
  int r = 1;
  int i = 1;
  while (i <= x) {
    r = r*i;
    i = i-1;
  }
  return r;
}
int factorialr (int x, int y) {
  if (x == 0) {return y;}
  tail factorialr(x-1, x*y); // Tail actúa como return
}
```

Intérprete de Brainfuck

``` c
module Brainfuck execute;
import std.file;
// No voy a usar esto, en cambio voy a usar std.file.readFileContents
string loadFile (string fileName) {
  std::file::File file = std::file::getFileByName(fileName, std.file.Read);
  return file.readContents();
}
const heapSize = 256;
struct BrainfuckHeap {
  &Array<int, heapSize> heap = Array<int, heapSize>;
  int pos = 0;
}
methods BrainfuckHeap {
  void inc () { this.heap[this.pos] = this.heap[this.pos] + 1; }
  void dec () { this.heap[this.pos] = this.heap[this.pos] - 1; }
  void fwd () { this.pos = this.pos + 1; }
  void bck () { this.pos = this.pos - 1; }
}
void execute (string program) {
  int pos = 0;
  // Quiero que este array esté en el Stack, pero no sé cómo hacerlo si:
  // - No tengo sintaxis para hacerlo.
  // - Los mecanismos para saber el tamaño de la clase no funcionan
  //   con arrays porque ¡Son de tamaño variable!.
  &Array<int> heap = new Array<int>(heapSize);
  while (pos < program.length()) {

  }
}
```

## [2016-02-14 02:40] Tipos de creación de objetos

Hay tres _espacios_ en los que puede vivir un objeto: __Stack__, __Heap__, y __Memoria__. Los objetos del __Heap__ son eliminados automáticamente cuando la máquina detecta que no se van a usar más (Usando colectores de basura, o contadores de referencia, etc.). Los objetos del __Stack__ son eliminados una vez que la función que los creó termina, o el objeto al que pertenecen se elimina. Los objetos de la __Memoria__ no se eliminan automáticamente, deben ser eliminados a mano por el programa.

Los objetos en __Heap__ pueden ser un poco más lentos de usar. Los objetos en __Stack__, si se usan en un contexto que vive más tiempo que el contexto que los creó, pueden crear referencias inválidas, que es muy peligroso en un programa. Los objetos en __Memoria__, si no se eliminan, pueden crear _leaks_ de memoria, y si se eliminan antes de que se dejen de usar, pueden crear referencias inválidas. Quien genere código para la máquina virtual (Una persona o un programa) debe tener en cuenta estos peligros y asegurarse de usar bien los espacios. En caso de duda, siempre hay que usar el __Heap__.

Los "espacios" no lo son realmente, en el sentido de que no hay ninguna obligación de que estén en lugares definidos en la memoria, en realidad un programa no puede ver la diferencia entre un objeto residente en cualquiera de los espacios, y teóricamente, las reglas garantizan que un programa nunca interactúe con objetos que ya no existen (si se siguen...), así que una implementación podría solo tener Heap y los programas nunca se darían cuenta de que solo trabajan con un espacio, es completamente transparente para ellos. Los espacios solo son pistas para que la implementación de la máquina pueda optimizar más fácilmente. A diferencia de las implementaciones modernas de C (que toman pistas de este tipo como "sugerencias de simples humanos" y no les paran mucho), se espera que las implementaciones de máquinas virtuales aprecien estas sugerencias y traten de sacarle el máximo provecho, y que los compiladores para la máquina virtual se tomen su tiempo para buscar estas pistas y hacerlas saber, a veces es más fácil para ellos deducir de dónde hay que para la máquina.

## [2016-02-14 08:42] Primitivos son objetos, y Arrays

Los primitivos son objetos! Esto es medio raro en un lenguaje de bajo nivel. Quiero que los primitivos sean objetos y tengan métodos. Es como si un primitivo fuera una clase, que exige siempre estar en el stack y ser inmutable, quiero que ese comportamiento este disponible para otras estructuras de datos creadas por el programador.

Lo otro de esta nota son los Arrays. Guardar un objeto en el stack, o en cualquier sitio, funciona porque se sabe el tamaño de la clase del objeto. No para los Arrays. Los Arrays son de tamaño variable, solo saber la clase (Array) no es suficiente para saber su tamaño, hay que saber el tamaño en sí (duh), pero eso es una variable del propio Array... oh diantres.

__Hacer una excepción__: Nunca me ha gustado esta idea. No quiero hacer excepciones solo para una clase. Quiero ser justo!

__Una clase para cada tamaño de array__: Esto es, en vez de una sola clase _Array_, tener _Array1_, _Array2_, _Array3_, hasta infinito. Obviamente no se van a guardar todas las clases posibles, se van a generar automáticamente (Esto es una excepción... no gustarme).

__Clases genéricas reciben valores__: Las clases genéricas son las que trabajan sobre clases en sí, es decir, una Lista es genérica porque puede trabajar sobre números, strings, o incluso otras listas. __Array__ es genérico por eso mismo, puede ser un array de cualquier tipo. Aprovechando esto, se podría hacer que los Array reciban además de una clase, un número, que es el largo del Array. Si esto lograra funcionar, sería extremadamente versátil, el usar valores para los genéricos, pero tratar de hacer esto es buscarse muchos problemas.

En Pascal no hay un tipo Array, se pueden crear tipos basados en arrays pero no hay arrays genéricos. Los tipos Array en pascal, además, tienen tipo contenido y tamaño, codificado en el tipo. Igual, no creo que pascal sea el sistema de tipos mejor diseñado del mundo.

## [2016-02-15 17:55] Tipos de tamaño Variable, y Bytefield

Primero: Creo que voy a hacer la excepción con los Arrays, pero luego pensé más y se me ocurrió lo de abajo.

Hay otro tipo nativo de tamaño variable que se me ocurrió: El Bytefield (También se podría llamar Freespace). Es un array de bytes, que se puede usar para guardar cualquier valor en cualquier posición sin ninguna restricción (Excepto que no se puede usar valores fuera del espacio). Sirve como Buffer o como Heap. Se puede usar para guardar información binaria, y como Unión (tipo C).

Creo que el Bytefield puede usarse como tipo básico, siendo la única excepción de tamaño variable, y los arrays implementarse sobre estos.

Hay un problema con los Bytefields: No se pueden implementar en Javascript o en Java, o al menos no muy fácilmente. Talvés esto se pueda solucionar poniendo algunas reglas, porque ya de por sí esta estructura es muy peligrosa, y poco compatible entre diferentes plataformas, por el endianness y la manera de representar los datos.

## [2016-02-16 10:06] Gramática para tipos

Intento de gramática para declaración de tipos de variables

    def := vardef | fundef | typedef
    vardef := type ident '=' exp
    fundef := 'fun' type {',' type} ident paramlist block
      paramlist := '(' param {',' param} ')'
      param := type ident
    typedef := type

    decl := type ident '=' def
    type := ident | class | func
    class := ['&'] ident ['<' {(ident|int)} '>']
    func := 'func' (type | '(' {type} ')') (type | '(' {type} ')')

    # semantic phase
    primitive-ident :=
        'int'|'float'|'bool'|'byte'|'var'|'void'|
        (('u'|'i'|'f') ('8'|'16'|'24'|'32'))

## [2016-02-17 18:42]

```c
module me.Collections;
require Core.Arithmetic;
require Std.Collections;
class LinkedList <T> {
  
}
```