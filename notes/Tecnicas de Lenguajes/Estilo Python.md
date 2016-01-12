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

## Notas

Cosas de las que me dí cuenta después de jugar un poco con el lenguaje.
Los objetos no son simplemente diccionarios, son más complejos que eso.
Los objetos de tipo nativos son más como clases compiladas tipo C++, pero con
la habilidad de saber el nombre de esos campos en ejecución. Las instancias
de clases, además de tener sus propios campos nativos, usan un diccionario
para guardar atributos dinámicos (que en sí mismo es un campo nativo). Cuando
se usa un objeto, python hace una búsqueda de argumentos, que busca primero
en los campos nativos, si es una instancia busca después en su diccionario
de atributos. Si python no consigue el atributo, empieza la búsqueda de
métodos, que es, busca en el tipo (o clase) de un objeto para ver si tiene
una función con el nombre (normalmente están en un diccionario de la clase).
Si la consigue, crea una función personalizada que cuando se llama, ejecuta la
función encontrada pasando el mismo objeto como argumento, algo así:

    if type(x).hasattr(attrname):
      if type(type(x).getattr(attrname)) == method
        return lambda: type(x).getattr(attrname)(x)

Si la clase del objeto no contiene el método, sigue buscando en toda la
ascendencia de clases del mismo modo. Si no consigue nada después de esto,
se rinde y lanza un error.

Los módulos también son como las instancias, tienen un campo nativo que es un
diccionario, y ahí es donde se guarda todo lo que tiene que ver con el módulo.

Otra cosa con python, específicamente con "new-style class", Si se tiene:

    Class Foo:
      def __call__(self):
        return 5
    f = Foo()
    f.__call__ = lambda: 4
    f()   # -> 5

En este ejemplo, con las clases nuevas, `f()` ejecuta el método especial que
está en la clase, salta lo que sea que puede tener la instancia, y devuelve 5.
Esto se hizo así porque, si python primero buscara los métodos especiales en
los atributos, `Foo()` daría error, porque está usando el método que devuelve
5, en vez del estándar que crea nuevas instancias. En las clases viejas sí
funciona, no sé que hacían, pero en las clases viejas los métodos especiales
se buscaban primero en los atributos de la instancia.
