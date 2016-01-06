# Estilo Python

## Objetos

Todo en python es un objeto. TODO. Un objeto en python es un array asociativo,
se pueden asignar y modificar tantos atributos como se desee (excepto algunos
que están protegidos, pero son iguales a los demás).
A los slots de los objetos se les llama atributos en nomenclatura python.

Nota: Para inspeccionar todos los atributos de un objeto, se puede usar la
función `dir(x)` para ver todos los posibles atributos que se pueden sacar
del objeto, y `x.__dict__` para ver los atributos que le pertenecen
directamente al objeto.

## Módulos

A algunos objetos se les llama espacio de nombre, porque se usan principalmente
para llegar a otros objetos del programa, en vez de para usarlos por sí mismos.
Los módulos son espacios de nombre que resultan de importar y compilar un
script externo, tienen funciones y valores de utilidad y son accesibles al
resto del script.

## Clase

Las clases son espacios de nombre que pueden tener instancias. Las clases
ofrecen constructores para sus instancias, que son, funciones especiales que
reciben la nueva instancia como argumento y la preparan para usarse como tal.

## Instancias

Una instancia de una clase solo un objeto uqe haya sido inicializado por esa
clase. La clase de un objeto está en el atributo especial `x.__class__`.
Al llamar un método de instancia `instance.dostuff()`, python busca la clase
más cercana que tenga un método `dostuff` y llama ese método de la clase,
pasando la instancia como primer argumento (explícitamente, no en una variable
oculta como "this", uno tiene que aceptar la variable explícitamente).
Al instanciar una clase (con `x = Class()`), python crea un objeto, le pone
el atributo `x.__class__ = Class`, y luego invoca el método constructor de 
la clase con ella, `Class.__init__(x)`.

## Herencia

Las clases heredan los métodos de instancia de los padres. Los constructores
de los padres no se llaman automáticamente, hay que invocarlos manualmente.
Python soporta herencia múltiple, y solo tiene un tipo de herencia, clases
heredando de otras clases. La búsqueda de métodos en Python se hace en el
momento en que se llaman, por lo tanto no hacen falta métodos virtuales como
en C++, simplemente se define un nuevo método en la clase hija con el mismo
nombre para sobreescribirlos.

