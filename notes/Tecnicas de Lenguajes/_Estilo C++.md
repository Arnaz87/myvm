# Estilo C++

Primero hay que ver los conceptos de C antes de ver los de C++.

## Valores y Tipos

En la memoria solo se guardan bits, por sí solos no tienen ningún significado,
pero en C estos bits se pueden representar como números, boleanos, letras, etc,
y es responsabilidad de C saber el significado de las secciones de memoria
que utiliza. Los valores son secciones pequeñas de las cuales C conoce su
significado. Los valores son lo que se pasa a las funciones y se devuelve de
ellas.

En C hay tres tipos de valores: simples, puntero y complejos. Los valores
simples son cosas como números o letras, con los que se puede interactuar
y se pueden modificar sin necesidad un mecanismo complejo. Puntero es en
realidad un valor simple, que simboliza una dirección en la memoria, apunta
a otro valor, que es la información importante de un puntero, y para
interactuar con esa información se necesita un mecanismo, que es la razón por
la que lo separo de los valores simples. Los valores complejos son las
secciones de memoria que ocupan más de unos pocos bytes. Los complejos son
simplemente un montón de otros valores más simples (o complejos) agrupados.
La diferencia es que con estos valores, C tiene que saber el significado tanto
del valor complejo como un todo, como de los valores agrupados dentro de este
valor complejo por separado. Igual los punteros, C tiene que saber el
significado del puntero en sí, así como el significado del valor al que se
apunta.

Hay dos tipos de valores complejos: arrays y structs. Un array es un grupo
de valores que tienen el mismo tipo, y siempre tienen una cantidad definida,
es decir, por ejemplo un array de 3 enteros. Con los arrays C solo tiene que
saber cuantos valores contiene el array, y de que tipo son los valores. Los
structs son, en cambio, un grupo de valores arbitrarios, por ejemplo un grupo
de un entero, una letra, otro entero y otro entero. Con ellos C tiene que saber
específicamente qué tipos contiene el struct, y a diferencia del array, cada
uno de los valores en el struct tiene su propio tipo, independiente de los
demás. En resumen, un array agrupa varios valores del mismo tipo, y un struct
agrupa varios valores de diferentes tipos. (Las uniones no se mencionan para
simplificar y porque no son relevantes para el sistema de clases)

Algo importante de los valores en C es que no pueden cambiar de tipo, es decir,
una vez que C haya decidido que una sección de la memoria es un número, siempre
será número hasta que C decida destruir el valor y dejar el espacio libre para
otra información, el número nunca será interpretado como una letra u otro tipo
(Esto es lo que debería ser, en la práctica C tiene mecanismos que permiten
interpretar un valor con diferentes tipos, como uniones, casting o aritmética
de punteros, pero no se mencionan porque no son relevantes).

El unico que sabe el tipo de todos los valores en un programa es el compilador,
es decir, no hay manera de que los datos sepan que tipo tienen otros valores.
Una vez que el programa compila, toda esta información se pierde y lo único
que se puede ver es lo que C decidió hacer con cada valor, pero no lo que sabe
de ellos.

### En resumen

Hay dos tipos de valores, los simples y los complejos. Los simples son cosas
como números o letras, triviales de interpretar y modificar, y los complejos
son los que agrupan varios valores más simples. El puntero es un tipo especial
de valor que apunta a otro valor más simple, no lo considero simple ni
complejo. El único que sabe los tipos de los valores es el compilador.

## Código

En C el código se guarda en memoria, pero en un lugar diferente que los datos.
No se puede interactuar con el código como si fueran datos. Como el código se
guarda en memoria, para ejecutarse se necesita la dirección del código, pero
esto solo lo sabe el compilador. Hay una manera de hacer que el compilador
guarde una dirección de memoria en los datos. Como un puntero apunta a una
dirección en la memoria, es perfectamente válido que apunte a una sección de
código, de este modo se puede ejecutar código sin que el compilador sepa
exactamente qué código es, y es muy útil en algunos casos, pero se hace poco,
no porque sea malo o peligroso, sino porque generalmente no hace falta y es
más fácil dejar que el compilador se encargue de todo.

## Clases Simples C++

C++ aprovecha los structs y el hecho de que el tipo de un valor no puede
cambiar para implementar las clases. Al definir una clase, se define qué
datos tiene una instancia y a qué métodos puede responder. Trabajaremos con
las clase de ejemplo: `class Carro {int ruedas; void andar(); Carro ();}`
y los objetos `Carro carro;` y `Carro *pcarro = new Carro();`.

Una instancia de la clase Carro simplemente tiene el tipo `struct{int ruedas}`,
y cuando se hace `carro.ruedas` es lo mismo que pedir un campo de un struct.
Todo esto es resuelto en compilación y, cómo carro siempre tiene la misma
posición y ruedas siempre tiene la misma posición dentro de carro, pedir un
campo de una instancia resulta en un acceso a una dirección determinada de la
memoria. Con _pcarro_ es casi igual de simple, pero como es un puntero, hace
falta extraer la dirección a la que apunta _pcarro_ y luego sumarle el offset
de _Carro.ruedas_.

Los métodos de instancia son solo una abstracción también. Los métodos de una
clase en realidad son simples funciones de C pero con un nombre elaborado, por
lo tanto "Carro.andar" es un nombre de una función (Ese nombre no es válido en
C, y en C++ solo es válido para las clases, no para un programador. Un
programador C tendría que usar algo como "carro_andar"). Como el compilador
sabe que _carro_ es un _Carro_, puede simplemente traducir `carro.andar();` a
`Carro.andar(&carro);`, o como tendría que hacerlo un programador C
`carro_andar(&carro);`. Se pasa una referencia en vez del valor en sí para que
la función pueda modificar la instancia que la llama. Todo esto es obra del
compilador, el programa final simplemente llama una función X con un argumento
Y, no tiene idea de clases ni nada por el estilo. Igual, con `pcarro->andar();`
es lo mismo pero con un puntero, el compilador sabe la clase de la variable
a la que apunta y, como es un puntero, no hace falta pasar una referencia,
se pasa el propio puntero: `carro_andar(pcarro);`.

Con respecto al código de constructor, no es necesario explicarlo. Es fácil
deducir más o menos que haría el compilador con `Carro carro;`, y con
`new Carro()` pues hace lo mismo pero inicializándolo en el heap y devolviendo
el puntero de la instancia.

## Herencia en C++

Las clases en C++ pueden heredar de otras clases. Una clase A que hereda de B
tiene, ademas de sus propios campos y métodos, todos los campos y métodos de B.
Asumamos las Clases `class Vehiculo {int velocidad; void andar();}` y
`class Carro public Vehiculo {int ruedas; void rodar;}` y una instancia
`Carro carro;` y `Carro *pcarro = new Carro()`.

El struct de Vehículo es `struct{int velocidad}`, pero el de carro ahora es
`struct{Vehiculo vehiculo; int ruedas;}`. Cuando se usa `carro.velocidad`, el
compilador sabe que _Carro_ no tiene ningún campo _velocidad_ pero que hereda
de _Vehiculo_ y este sí tiene un campo _velocidad_, entonces puede hacer
`carro.vehiculo.velocidad`. Aunque en el código parece que hay una capa
adicional entre carro y velocidad, hay que recordar que el compilador siempre
traduce esto a direcciones de memoria exactas y que no hay un precio adicional.
Con un puntero sí hay una capa adicional, pero es por ser puntero, no por
heredar de vehículo, en `(*pcarro).ruedas` es un acceso para dereferenciar
_pcarro_ y otro para acceder a ruedas, y en `(*pcarro).vehiculo.velocidad`
también es uno para dereferenciarlo pero _vehiculo.velocidad_ cuenta como un
solo acceso. `struct{Vehiculo vehiculo; int ruedas;}` es equivalente a
`struct{int vehiculo_velocidad; int ruedas;}`.

Si se usa `carro.andar();`, lo mismo, el compilador sabe que la clase _Carro_
no tiene ningún método _andar_ pero que _Vehiculo_ sí, pero como el struct de
Carro es diferente que el de Vehículo, si se hace `Vehiculo.andar(&carro);`
no funciona porque _Vehículo.andar_ solo funciona con un _struct Vehiculo_,
así que en cambio, el compilador hace `Vehículo.andar($carro.vehiculo);`

## Herencia múltiple

Las clases de C++ pueden heredar de varias clases a la vez. Supongamos

    class Vehiculo {int velocidad; void andar();}
    class Rodable {int ruedas; void rodar();}
    class Carro public Vehiculo, Rodable {int ventanas;}

Es muy simple, simplemente el struct de Carro ahora es
`struct{Vehiculo vehiculo; Rodable rodable; int ventanas}`. El compilador ya
sabe cómo buscar un campo de una instancia o un método en una clase.

Esto tiene problemas sin embargo. El primero es algo como esto
    
    class Carro {int velocidad}
    class Avion {int velocidad}
    class CarroVolador public Carro, Avion {}
    CarroVolador volador;

En este caso, qué pasa si se usa `volador.velocidad`? No se sabe si se refiere
a su velocidad de carro o a su velocidad de avión. La solución es un poco de
trabajo extra del programador: hay que hacer casting a la Clase que se desea
usar: `*(Carro &volador).velocidad`, que es equivalente a
`volador.carro.velocidad`, pero el segundo no es legal porque C++ no expone la
estructura interna de las instancias de ese modo, es más o menos como las
representa pero no exactamente. También hay calificación explícita, que tiene
esta forma `volador.Carro::velocidad`, pero no estoy seguro.

Otro problema, un poco peor, es:

    class Vehiculo {int velocidad}
    class Carro public Vehiculo {int ruedas}
    class Avion public Vehiculo {int alas}
    class CarroVolador public Carro, Avion {}
    CarroVolador volador;

Los structs de las instancias de las clases quedarían así:

    struct Vehiculo {int velocidad}
    struct Carro {Vehiculo vehiculo; int velocidad}
    struct Avion {Vehiculo vehiculo; int velocidad}
    struct CarroVolador {Carro carro; Avion avion}
    // O con los campos sin capas:
    struct CarroVolador {Vehiculo carro_vehiculo; Vehiculo avion_vehiculo; ...}

De aquí, si queremos usar uno de los campos de Vehiculo, cuál Vehículo se
debería usar? el que viene con avión o el que viene con carro? Y si queremos
convertir _volador_ a vehículo, lo mismo, cuál se debería usar? No es tan
fácil como con el conflicto de nombres porque aquí uno puede no saber si
quiere la implementación de carro o de avion, uno solo quiere la implementación
de vehículo.
No estoy seguro de cómo se soluciona esto en C++, creo que es usando herencia
virtual pero aún no sé cómo funciona.

## Métodos Virtuales

De aquí en adelante usaremos punteros a objetos, en vez de valores de objetos,
es decir, ya no es `Carro carro;`, sino `Carro *carro = new Carro();`, esta es
aparentemente la forma más popular de trabajar con clases en C++.

