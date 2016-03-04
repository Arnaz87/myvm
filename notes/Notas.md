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
```
