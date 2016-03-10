# Notas

## [2016-02-26 00:53] Comunicación entre máquinas

Quiero que haya un protocolo para que las máquinas puedan comunicarse directamente. Con eso se pueden implementar cosas como un Juego en línea con el servidor hablándole directamente al cliente, un navegador Web usando la misma tecnología de ambos lados (en vez de javascript/php), un Renderizador que distribuye el trabajo entre varios nodos de la red, y otras cosas.

No quiero que para comunicar varios nodos haya que estar serializando datos, enviando código de scripting, ni nada así. Internamente, obviamente, esa es la clase de cosas que la máquina estará haciendo. Pero quiero que haya una interfaz limpia, que pueda enviar cualquier tipo de objeto a traves de la red de máquinas sin que el programador tenga que echarle demasiada cabeza. Y ya que la máquina está haciendo todo el trabajo, debería hacerlo bien: serializar en binario, lo más compacto posible, y con buen rendimiento.

## [2016-02-26 01:06] Green Threads, Soft Real Time, y algunas utilidades

Quiero Threads eficientes, super baratos, al nivel de Go.

Quiero rendimiento de tiempo real, es decir, debe poder usarse para aplicaciones que requieren tiempos de respuesta muy estrictos, como videojuegos, síntesis de audio, etc, en donde el programa no puede repentinamente dejar de responder.

Se me ocurrió la idea de Threads encajados, que se puedan usar como objetos. Con esto se puede guardar el estado de ejecución de un programa, y así se pueden simular corutinas, continuaciones, etc. Esto funcionaría mucho mejor si los threads son baratos.

Todo esto, en realidad, es dependiente de la implementación, pero debería ser asegurado que una buena implementación ofrece estas características.

## [2016-02-29 23:25] Sistema de tipos complejo

La máquina virtual tiene que tener un sistema de tipos que pueda manejar esta clase de problemas (en pseudocódigo):

    push3 :: Vector a 3 -> a -> Vector a 4

    tail :: (n => Int, n > 0) => Vector a n -> Vector a (n-1)

    get :: (n => Int, n > 0) => Vector a n -> Modulo n

    newVec :: Int -> Vector a _

## [2016-03-02 09:42] Intento de mecanismo de tipos

Quiero que la máquina tenga un sistema de tipos con la propia máquina a su disposición para resolver creación, equivalencias, dependencias, etc. Necesito también que todos estos calculos solo se puedan hacer en carga.

Estaba preocupado porque con las clases dinámicas iba a tener que hacer muchos de estos cálculos en ejecución, pero luego lo pensé y en realidad, lo único que habría que hacer es una sola computación para la equivalencia del tipo de un objeto dinámico a un tipo estático. De ahí en adelante, por el hecho de ser equivalentes, va a poder seguir siendo equivalente a cualquier tipo con que se haya probado con el tipo estático... Ni yo entendí lo que acabo de escribir, así que pondré un ejemplo en Cu:

``` java
Int lol (Limit<100> x) {
  Limit<200> xa = x;  // Static Success: Limit<100> => Limit<200>
  Limit<50> xno = x;  // Static Error: Limit<100> => Limit<50>
  return xa; // Static Success
}
Limit<50> a = 42;
lol(a); // Static Success: Limit<50> => Limit<100>
Int b = a // Static Success: Limit<50> => Limit<Infinity>
lol(b); // Static Error: Limit<Infinity> => Limit<100>. Solo depende del tipo de la variable, el tipo del valor se ignora.
Any c = a // Runtime type: Limit<50>. Nunca Falla.
Limit<100> d = c // Runtime Success: Limit<50> => Limit<100>
Limit<25> e = c // Runtime Error: Limit<50> => Limit<25>
lol(c); // Runtime Success: Limit<50> => Limit<100>
Any f = d // Runtime type: Limit<50>. No depende del tipo del valor, el tipo de la variable se ignora.
```

Aquí se ven algunas de las reglas.

* La máquina virtual se encarga de hacer resolver las equivalencias entre tipos al asignar variables.
* Cuando ambas variables tienen tipo, la equivalencia se resuelve estáticamente, y se ignora el tipo del valor.
* Cuando una de las variables no tiene tipo, la equivalencia se resuelve dinámicamente en base al tipo del valor, y se ignora el tipo de las variables.
* Los valores siempre saben su tipo dinámico desde que son creados, sin importar qué tipos sean las variables en donde son asignados.

Como se puede ver, el único momento en que la máquina hace conversión de tipos en ejecución, es cuando una de las variables no tiene tipo.

El problema con un sistema de tipos dependiente es que desordena el concepto que tenía de los Traits. Pero me parece más ganancia que pérdida el sistema de tipos, solo tengo que pensar en otro sistema para definir el comportamiento de un tipo.

## [2016-03-03 00:27] Cobre Nuevas

Hay dos lenguajes para la máquina virtual ahora. Uno es el más básico, que representa directamente la estructura de un módulo en texto, el único azúcar sintáctico es una sintaxis básica para el código en vez de ensamblador. Ese se llama _Palo Lang_ (o algo así, mejor _Palo IR_ (Palo Intermediate Representation)). El otro es de mucho más alto nivel, con sintaxis al estilo de C, pero como usa las abstracciones de Palo se parece un poco a C++ o a Java, pero es muy bajo nivel. Intenta ser el lenguaje usable más cercano a la estructura de la máquina. Este se llamará _Cobre_. Estoy pensando en ponerle
_Cu_, el símbolo del elemento, para que se parezca un poco más a C.

Si el lenguaje se llamara _Cu_, entonces probablemente la máquina podría llamarse _Cobre_, ahora hace referencia al Metal y todavía hace referencia al dinero en venezuela, pero ya no hace referencia a _Parrot_.

## [2016-03-03 00:52] Sistema de Traits

Como dije arriba, el sistema de tipos dependientes desordena el sistema de Trait.

**Lo que tenía**: La verdad no tenía mucho, y ahora que reviso esto, veo que al sistema de tipos dependientes también le falta definir detalles. Una variable debe tener una clase que define el comportamiento del objeto, pero cuando un tipo tiene un número no determinado de posibles tipos equivalentes, es dificil decidir como comportarse. Por ejemplo, `Limit<n>` es equivalente a cualquier `Limit<n+x>`, entonces cuando alguien quiera revisar si `Limit<n>` implementa algún Trait, es simplemente imposible revisar todos los tipos posibles hasta `Limit<Infinity>` para ver si alguno implementa un Trait.

De algún modo hay que hacer que el tipo directo de una variable sepa de antemano todos los traits que implementa.

Todos los valores necesariamente deben saber el tipo con que fueron creados. A eso le voy a decir _Clase_ o _Tipo Concreto_, los demás so _Tipo Abstractos_,
_Interfaces_ o sólo _Tipos_.

La clase define la estructura en memoria de un objeto y el tamaño que ocupa. La clase también es responsable de resolver sus equivalencias con otros tipos. No existen métodos para la máquina virtual, eso es una abstracción del lenguaje, solo existen funciones.

Un trait es un comportamiento que se puede definir en diferentes combinaciones de clases, y la máquina virtual se encargará de elegir la implementación más adecuada para cada combinación de argumentos.

Con estos conceptos, la máquina tiene que saber diferenciar 3 tipos de tipos: Los tipos concretos o clases, los tipos abstractos, y los tipos implementables o traits. Los tipos abstractos por lo que veo no sirven de mucho. Todas las funciones que reciban tipos abstractos y quieran manipular el objeto, de algún modo en algún momento deben acceder al tipo concreto, ya qué ese es el único con la información de la estructura del objeto.

## [2016-03-03 15:31] Problemas con traits

Algunos ejemplos que saqué de http://research.microsoft.com/en-us/um/people/simonpj/papers/assoc-types/fun-with-type-funs/typefun.pdf

``` java
trait Addable <A, B, C> {
  C add (A,B);
}

// Un detalle con esta sintaxis, esto esta implementando el trait para Ints, y dentro de la implementación también uso Int, pero no sé si estoy usandolo comno uno de los parámetros, o solo porque me dio por usarlo sin ninguna relación a los parámetros.
impl Addable <Int, Int, Int> {
  Int add (Int a, Int b) { return a + b; }
}
impl Addable <Float, Int, Float> {
  Float add (Float a, Int b) { return a + b.toFloat(); }
}
impl Addable <Int, Float, Float> {
  Float add (Float a, Int b) { return a.toFloat() + b; }
}

trait Cons <A, B> {
  List<B> cons (A, List<B>);
}
impl Cons<Int, Float> {
  List<Float> cons (Int x, List<Float> ys) {
    return ys.append(x.toFloat());
  }
}

typerel SumResult<Type, Type>;
instance SumResult<Int, Int> = Int;
instance SumResult<Int, Float> = Float;
instance SumResult<Float, Int> = Float;

trait Sumable <A, B> {
  type C
  C mult (A, B);
  SumResult<A,B> add (A, B);
}

impl Sumable <Int, Float> {
  Float mult (Int a, Float b) {
    return a.toFloat() * b;
  }
}

struct MyGraph {};
struct Node {};
struct Edge {};

// Tipos Asociados 1
trait Graph <G> {
  type N, E;
  Bool hasEdge (G, N, E);
  List<E> edges (G, N);
}

impl Graph <MyGraph> {
  type N = Node;
  type E = Edge;
  Bool hasEdge (MyGraph g, Node n, Edge e) {return true;}
  List<Edge> edges (MyGraph g, Node n) { return emptyList(); }
}

// Tipos Asociados 2
typerel GraphNode<G>;
typerel GraphEdge<G>;
trait Graph <G> {
  Bool hasEdge(G, GraphNode<G>, GraphEdge<G>);
  List<GraphEdge<G>> edges (G, GraphNode<G>);
}

typerel GraphNode<MyGraph> = Node;
typerel GraphEdge<MyGraph> = Edge;
impl Graph <MyGraph> {
  Bool hasEdge (MyGraph g, Node n, Edge e) {return true;}
  List<Edge> edges (MyGraph g, Node n) { return emptyList(); }
}

// Vector
class Vector<Int N> {
  @stack Array<Int, N> arr;
  Int index (Range<N-1> i) {
    return arr[i];
  }
  void sum_const (Int other) {
    for (i until N) {
      arr[i] += other;
    }
  }
  void sum_vec (Vector<N> other) {
    for (i until N) {
      arr[i] += other[i];
    }
  }
  Vector<N+1> append (Int value) {
    Vector<N+1> = new Vector<N+1>
    for (i until N) {
      other[i] = arr[i];
    }
    other[N+1] = value;
    return other;
  }
}
```

``` Haskell
class Show a where
  show :: a -> String

class (a => Show) => Show (Maybe a) where
  show (Just a) = "(Just " + (show) a + ")"
  show Nothing  = "Nothing"

class Monad m where
  return :: a -> m a
  (>>=) :: m a -> (a -> m b) -> m b
  (>>) :: m a -> m b -> m b

instance Monad Maybe where
  return a = Just a
  Just a >>= f = Just f a
  Nothing >>= _ = Nothing
  Just a >> Just b = Just b
  _ >> _ = Nothing
```

## [2016-03-04 10:45] Problema con tipo para función

Las funciones deben poder tener tipo, y lo más lógico sería clasificar las funciones en cuanto a qué argumentos reciben y qué devuelven. La máquina actual puede recibir varios argumentos y botar varios resultados, y los tipos genéricos reciben un arreglo de argumentos. Es problemático pasar un número variable de argumentos a un tipo que recibe un número fijo de parámetros, y mucho peor pasar Dos grupos de argumentos variables. Este es el problema con las funciones.

La solución que se me ocurrió es que la máquina deje de soportar argumentos y retornos variables, en vez que solo reciba un argumento y devuelva un valor. El lenguaje puede ser capaz de abstraer esta limitación usando Tuples automáticamente. Además, si el programa sigue las reglas y usa trucos como los tipos abstractos _Value_ e _Immutable_, la máquina puede optimizar el rendimmiento.

Con esto, se simplifican las funciones, se le da más libertad a los programas, y se soluciona el problema con los tipos. Un lenguaje puede usar:

- `Int parseInt(String)` con tipo `Function<String, Int>`
- `Int, Bool parseInt (String)` con tipo `Function<String, Tuple2<Int,Bool>>`
- `String format (String, Any...)` con tipo
  `Function<String, Tuple2<String, Array>>`

El problema es que da demasiada libertad, y ahora `Int sqrt(Int)` puede ser, dependiendo del lenguaje, `Int, Int` o `Tuple1<Int>, Tuple1<Int>`.

Una solución a esto es estandarizar un sistema de tipos único que resuelva las ambiguedades y que todos los lenguajes deben seguir. Propongo:

- `Tuple<N>`, es un arreglo de tamaño fijo, con N>1. Cada miembro del arreglo debe ser un `Tipo`.
- `Varargs`, un arreglo de tamaño dinámico, con cada miembro siendo un `Tipo`.
- `TypedVarargs<T>`, igual que Varargs pero con cada miembro siendo un `T`.
- Si el tipo de una función es un `Array` o algún otro contenedor, no cuenta como `Varargs`, sino como un solo miembro.

## [2016-03-07 11:02] Módulo dentro de módulo

El módulo es la unidad de trabajo de la máquina virtual, es lo que se importa y lo que se debe crear para poder ser usado. Lo más importante de un módulo son sus constantes, el mismo módulo las define, la máquina las crea al cargar el módulo, y luego se comparten para que el resto de los módulos de un programa puedan usarlos. Entre estas constantes están las funciones, las clases, traits, tipos, y algunos objetos y valores constantes. Las constantes de un módulo están definidas en base a las constantes que ya existen en el programa, las que fueron cargadas de otros módulos anteriores al actual, y cuyos nombres están especificados en las dependencias del módulo al cargar.
Las funciones tienen acceso directo a las constantes del módulo al que pertenecen por gracias a un registro de constantes del módulo, igual que el registro de variables de la función.

Ahora el problema. Cuando se definen computaciones arbitrarias con constantes, a veces se pueden crear más constantes dependiento de los parámetros de la computación. Pero los módulos tienen un número fijo de constantes, y el hecho de que se puedan crear más arbitrariamente cada vez que se invoca una computación de constantes, es un problema porque no hay espacio en donde ponerlas.

Por ejemplo con las funciones genéricas de Java. Cada vez que se usa una, está usando un tipo que se pasa como parámetro a la función, pero la resolución de tipos es estática, por lo tanto el tipo parámetro debe ser constante, pero no puede ocupar un espacio en la tabla de constantes de un módulo (como es de tamaño fijo, significa que ya está llena), y aún si pudiera los tipos parámetros posibles son potencialmente infinitos. Tampoco puede estar en los registros de variables porque no es un valor de runtime, es una constante. ¿Entonces en donde se pone el tipo parámetro? Este es el problema.

``` java
// En donde se guarda T, para que la máquina sepa qué es?
T ifthenelse<T> (Bool t, T a, T b) {if (t) {return a;} else {return b;}}
int main { return ifthenelse<Int>(true, 42, 17); }

// Esta tiene además una clase variable que no está en los parámetros.
List<T> pair<T> (T a, T b) {return new List<T>().add(a).add(b);}
void main { List<Int> x = pair<Int>(1,2) }


// ???
type Pair4 = Pair<T,Pair<T,Pair<T,Pair<T,Null>>>>
```

Una opción es que los módulos reciban parámetros, y por cada función o clase genérica (en el caso de java), se vuelva a cargar el módulo, con definiciones separadas, guardando los parámetros en la tabla de constantes. El detalle con esto es que desordena el sistema de módulos de los lenguajes, y otro es que puede llegar a sobrecargar de módulos a la máquina. Con esta idea no estoy considerando computación de constantes, y si no es compatible es otra desventaja.

```
// pair.module
T (Type) { @param 0 }
List (Module) { @import "lang.list" }
ListT (Class) { @instance List, T }
main (Function) {
  @params T, T
  @returns ListT
  _list = new ListT
  _arg_0 = Args[0]
  _arg_1 = Args[1]
  _add = ListT.add
  _add(_list, arg_0)
  _add(_list, arg_1)
  Args.clear
  Args[0] = _list
  end
}

// main.module
List (Module) = @import "lang.list"
List_T (Class) = @instance List, T
pair (Module) = @import "pair"
pair_Int (Class) = @instance pair, T 
const_1 (Int) = 1
const_2 (Int) = 2
main (Function) {
  Args[0] = const_1
  Args[1] = const_2
  x : List_T = pair_Int() // Esta línea...
  end
}
/* Esa línea... No tiene que ver con lo de los módulos paramétricos pero tengo que explicarlo:
La máquina, solo con leer el archivo, sabe que x es List_T, pero no sabe qué es el resultado de pair_Int. Tiene que cargar el módulo, cargar pair, y resolver todas las constantes para saber lo que devuelve.
Luego, la máquina ya sabe lo que devuelve pair_int, pero como está en otro módulo y es una instancia, no sabe si es lo mismo que List_T, así que también tiene que hacer esa comparación (depende de la implementación, la máquina podría o no determinarlo inmediatamente).
Todo esto se hace en carga, y ahora sí está comprobado que el programa es correcto. Se le permite a una implementación con requerimientos muy estrictos saltarse este análisis, pero no se recomienda porque los errores de tipos pueden ser muy peligrosos. */
```

```
// ifthenelse.module
T (Type) { param 0 }
Boolean (Type) { import "core.Boolean" }
main (Function) {
  params(Boolean, T, T)
  returns(T)
  cond = Args[0]
  jumpifn cond :else
  result = Args[1]
  clearArgs()
  Args[0] = result
  end
  :else
  result = Args[2]
  clearArgs()
  Args[0] = result
  end
}

// main.module
ifthenelse (Function) { module "ifthenelse.main", Int }
const_0 (Boolean) = true
const_1 (Int) = 42
const_2 (Int) = 17
main (Function) {
  returns(Int)
  ...
}
```

Otra opción es que, además de las funciones (y clases) comunes, existan funciones (y clases) paramétricas. Los parámetros constantes entonces se guardarían en una tabla de registros, separada de las variables y las constantes del módulo. Es un mecanismo un poco más complejo que los módulos paramétricos.

Me parece que la solución más limpia son los módulos paramétricos. Lo que hay que hacer para que no desordene el sistema de módulos de los lenguajes es pensar en un sistema estándar para determinar cuando un módulo debe ser una función, una clase, un módulo común, o cualquier otra cosa.

## [2016-03-10 10:39] Registros especiales

Si los argumentos en vez de pasarse por un stack especial, se pasan como un objeto común, entonces bien pueden ser registros comúnes de la función. Entonces el código podría usar los parámetros directamente, algo así:

    a = Args[0]
    b = dostuff(a)
    Args[0] = b
    end

Se simplificaría

    _return dostuff(_param)
    end

Si fuere con tipos

    $params(Foo)
    $returns(Bar)
    a: Foo = Args[0]
    b: Bar = dostuff(a)
    Args[0] = b
    end

Sería algo como

    _param: Foo
    _return: Bar = dostuff(a)

O con un esquema complicado de parámetros

    $params(String, Int)
    $returns(Int, Bool)
    str: String = Args[0]
    radix: Int = Args[1]
    success: Bool = false
    result: Int = 0
    Args[0] = result
    Args[1] = success
    end

Sería en cambio

    _param: Tuple2<String, Int>
    str: String = _param.0
    radix: Int = _param.1
    _return: Tuple2<Int, Bool>
    _return.0 = 0
    _return.1 = false
    end
