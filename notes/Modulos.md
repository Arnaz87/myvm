# Modulos

Los módulos son las unidades fundamentales que la máquina puede cargar, y
conforman el ambiente en donde los programas corren.

Un módulo es básicamente un montón de objetos que la máquina virtual carga
(incluyendo, y principalmente, funciones), y un nombre por medio del cuál
se puede acceder a estos objetos desde cualquier punto del programa.

    Modulo: (Archivo)
      string nombre
      [string] dependencias
      [{
        string nombre
        int id
      }] tabla
      [Objeto] objetos

Esta es la estructura que viene en el archivo del módulo. La máquina virual
carga cada módulo como un objeto común, de tipo módulo, que es algo así:

    Modulo: (Objeto)
      String* nombre
      [{
        String* nombre
        Objeto* objeto
      }] tabla

Todos los objetos del módulo se cargan, pero solo aparecen en la tabla los
que aparecían en la tabla original, con su nombre, pero en vez de tener un id,
tiene una referencia real al objeto.

Por otro lado, la máquina virtual tiene una tabla de módulos cargados:

    Modulos: [{String* nombre, Modulo* modulo}]

Un programa puede acceder a un objeto de un modulo con la instrucción

module A B: busca en la tabla de modulos un objeto con el string de B y lo pone
en el registro R(A)
moduleget A B C: busca el modulo con nombre B, y en ese modulo, busca el objeto
con nombre C

Una vez que se obtiene un objeto de un módulo, el programa puede hacer lo que
quiera con él (que esté permitido, obvio)

Un programa no puede modificar un objeto modulo, ni la tabla de modulos
cargados, tampoco debe inspeccionar los datos internos, la única responsabilidad
de un módulo es responder cuando se llama con un string. La máquina virtual es
libre de optimizar una llamada a modulo de antemano, si se hace con un string
constante, cambiándola a una referencia directa.


# Ya sé cómo resolverlo

Tiene que haber un archivo aparte, con funciones nativas, no se cargan en la
máquina virtual, son para que la misma máquina las use. El módulo usa estas
funciones (entre esas, string compare), y luego se cargan las funciones en el
stack de métodos nativos y se cargan los módulos base.

Es decir, la implementación como tal no usa módulos cargados, usa métodos del
sistema, programados en C, al final es que se registran en la máquina virtual
para que el interprete las use, pero la implementación no usa estos métodos
registrados.

Por lo tanto, el buscador de módulos (el que busca un módulo de acuerdo a un
String nombre), para funcionar tiene que comparar strings, pero string es parte
del módulo string, que a su vez no se puede cargar porque falta su propia
implementación. Para solucionar esto, el buscador de módulos no usará los
métodos del módulo string, sino que usará úna función C de comparación de
strings y, luego, el módulo String registra esta misma función para usarse
dentro del programa.

# Metadatos

Lo estaba pensando, y creo que los módulos deberían ser metadatos, no objetos,
es decir, que no se pueda interactuar directamente con un módulo en el programa.
Ya que voy a usar metadatos en la máquina creo que es mejor si lo hago así.