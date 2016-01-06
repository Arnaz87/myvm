# Espacios de Memoria

## Stack

No sé si será un stack o puros registros o que...

Este espació se usa para los datos que se van a usar inmediatamente en la
función actual, al terminar la función, todo lo que está aquí se elimina.
Aquí se guardan números simples, que se pueden interpretar como Enteros,
Flotantes, Caracteres o Referencias, pero no tienen tipo, es decir, si se
toma uno al azar, no hay manera de decir qué tipo es, el interprete tiene
que saberlo de antemano para poder hacer operaciones con él.
Una referencia es un numero que indica en qué posición del heap se encuentra
el objeto referenciado. Si se elimina una referencia, no se elimina el
objeto referenciado, este permanece en el stack.

## Heap

Este es el espacio en donde se guardan los objetos duraderos del programa,
a diferencia del stack que guarda los valores que se van a usar inmediatamente.
Los objetos que se guardan aquí son en su mayoría complejos, excepto las cajas.

Al heap se le hace recolección de basura, no sé aún el algoritmo.

## Permanent

Este es como un heap, pero para objetos permanentes, que no deberían ser
recolectados como basura en ningún punto del programa. Aquí se incluye el
código, las constantes, las clases y los módulos.

# Valor

Los valores son los campos en un objeto y en el registro, su estructura es
un byte indicando el tipo de valor y luego el valor en sí. Los tipos pueden
ser nulo, entero, booleana, flotante, referencia. El campo del valor debe
contener la suficiente cantidad de bytes para el más grande de los tipos,
por ejemplo, debe ser capaz de contener una booleana de 1 bit, así como un
float de 32 (depende de la implementación, talves hasta un doble de 64).
Contiene bits arbitrarios y depende del tipo cómo se interpretan.

    struct Valor
      byte tipo
      union {int, float, *void, ...} valor

# Objetos #2

Los objetos son arrays de bytes o de Valores que se almacenan en el Heap.
La máquina virtual tiene instrucciones para acceder bytes o Valores, y para
crear objetos de tamaño fijo.

    struct Objeto:
      u16 size        // tamaño en bytes
      pointer Vtable  // vtable (o clase) de este objeto.
      byte[size] Datos

La plataforma ofrece estas clases nativas, cuyo funcionamiento es implementado
directamente en la máquna virtual:

## Vtable

Una vtable es una lista de las funciones virtuales estándar de la plataforma.
Sus datos son simplemente un array de funciones.

## Función

Es código ejecutable, el código se guarda como un objeto en el Heap. Sus datos
son un array externo de valores para poner en el stack, un array externo con las
clausuras, y un array de bytes interno con el bytecode.
Una función también tiene banderas, entre ellas están:
Unsafe: Indica que las instrucciones dentro de esta función no revisan el tipo,
esto las hace más rápidas, pero pueden echar a perder el programa
Minimal: Indica que la función es muy pequeña y puede aplicarse optimizaciones
como inlining, o ejecutarse sin registrar espacio del stack.

## Array de bytes, Array de valores

No tienen nada de especial, solo para indicar explícitamente que lo son.

## Indefinido

Igual, nada de especial, es para específicar que no se sabe qué es esto. Igual
se puede operar como cualquier otro objeto.

## Implementados

Cualquier otro tipo de clases, objetos, o estructuras abstactas de datos son
implementados por el desarrollador en bytecodes, como Tablas, Cajas, Listas,
Clases, Prototipos etc.

# Vtable

La plataforma define algunas funciones estándar a las que todos los objetos
pueden responder si lo desean, como recieveMessage, getAttribute, setAttribute,
add, equals, etc. Todos los objetos tienen una referencia a una Vtable, que es
simplemente un array de funciones, y cada una de las funciones estándar tienen
un espacio asignado en ese array, de este modo los desarrolladores pueden crear
objetos que se comporten de cualquier manera deseable, y que sea compatible con
otros objetos de otros desarrolladores. Las clases nativas no tienen una
Vtable asignada porque su comportamiento esta implementado directamente en la
máquina virtual, y si un objeto personalizado no tiene vtable, simplemente
lanzará error cuando se intente usar una función estándar con él. Del mismo
modo, si tiene vtable pero se usa una función que no está definida en ella,
también se lanza error. Pero solo si se intenta usar, pueden existir objetos
que no implementen funciones estándar.

# Instrucciones

## Aritméticas y Lógicas

Hay dos conjuntos de isntrucciones aritméticas, para enteros, y para flotantes.
Los tipos de los valores no se revisan en estas operaciones. Aquí también se
incluyen las operaciones de bits o las operaciones lógicas. Las que ambos
comparten son: add, sub, mult, div, neg, pow; las que son solo apra enteros:
mod, not, and, or, xor, left, right; ambos comparten las de comparación:
eq, neq, lt, lteq, gt, gteq; los booleanos solo operan en el primer bit:
not, and, or, xor, eq, neq.
Las operaciones de cada tipo vienen acompañados de un prefijo: i para enteros,
f para flotantes, b para booleanas.

## Registros

Estas instrucciones operan en el stack: mov (copia un registro a otro), null
(pone en un registro un valor nulo), loadk (copia una constante a un registro),
copy (copia una cantidad de registros de una posición a otra), typeset, loadi
(copia en un registro el valor del segundo byte de la instrucción)

## Flujo

Modifican el flujo de control. jump, jmpif, jmpifn, unsafe (activa la bandera
unsafe solamente para la siguiente instrucción)

## Funciones

Ejecutan funciones o tienen que ver con eso: call (trata un registro como si
fuera un puntero a una función y la ejecuta), msg (Envía un mensaje estándar
a un valor de un registro, si es un objeto, recurre a la vtable y ejecuta la
función correspondiente, y si es un primitivo, envía un mensaje su clase),
ret (termina la función), tailcall (lo mismo que call, pero en vez de registrar
una pieza dle stack, reusa la que usaba la función que la llamó), getmsg (Pone
una referencia de la función de un mensaje en el stack, para así poder hacer
tailcall o spawncall), spawncall (Crea un nuevo Thread y ejecuta la función ahí)

## Objetos del Heap

Modifican objetos del Heap: new (crea un objeto con x bytes de tamaño, luego
pone una referencia de él en el stack), getbyte, setbyte, getvalue, setvalue,
getvtable, setvtable, getuvalue, setuvalue (uvalue significa valor sin tipo,
en vez de ocupar 5 bytes, ocupa 4 (u de unsafe, o untyped))

# Mensajes Base

## Aritméticos

sum, sub, mult, div, pow, neg, inv
sumeq, subeq, diveq, multeq

## Lógicos

and, or, nand, nor, xor, not
andeq, oreq, xoreq

## Data

get, set, length, insert (push), extract (pop), find, contains, concat

## Misc

sendmsg, equals, tostring, hash, isa (instanceof), cast, compareto, call,
clone, getclass

---------

# Estructuras de Objetos

Todo lo que se guarda en el Heap es un objeto. Todos los objetos tienen un
primer byte que indica que tipo de objeto es, luego un byte con el tamaño
(no estoy tan seguro de eso), y después los bytes con los datos específicos
del tipo de objeto. Las siguientes secciones explican la estructura de
datos de cada tipo específico.

    struct Objeto:
      byte tipo
      byte size
      byte[size] Datos

## Caja

El tipo caja es un número con un único valor.

    struct Caja.datos:
      Valor val

## Tabla

Tabla, mapa, o hash en otros lenguajes. Tiene varios slots con un nombre y
cada uno de ellos está asociado a un Valor.
Internamente está implementado con un Array de llaves, y uno de valores, y
cada llave y valor asociados tienen el mismo índice. La organización la
definen las llaves, y puede variar: si es pequeña, no hay organización
y para buscar un valor solo se hace un recorrido por todos, si es grande,
se organiza en una hashtable.
Ademas de estos dos datos, también puede tener una lista de prototipos, que
son tablas en las que buscar si un valor no existe en la actual.

    Tabla.size = 1
    struct Tabla.datos:
      *((String, Valor)[]) valores

## Instancia

Es una instancia de alguna clase. Su estructura es una referencia a la clase
a la que pertenece, y luego todos los campos de ese objeto, organizados como
un array pero en el mismo objeto. Si es dinámico, la tabla con campos
dinámicos es uno de los campos normales.

    struct Instancia.datos:
      *Clase clase
      Valor[clase.instance_size] valores

## Clase

Es un Objeto que puede tener instancias, pero a su vez es una instancia de
la clase Clase. Tiene una lista de clases padres, una lista de nombres
de campos, y los campos de esta instancia.


    struct Clase.datos:
      Clase[] padres
      String[] campos_instancias
      Codido[] metodos
      Valor[this_instance_size] valores

## Array

Es un array de Valores, es mutable pero tiene un tamaño fijo.

    struct Array.datos
      int size
      Valor[size] datos

## Binario

Es solo un objeto simple sin ninguna organización predeterminada de sus datos,
se usa para manejo personalizado de memoria desde el programa, no se recomienda
para usos de implementación.

## Código

Un objeto de código. Tamaño stack es el espacio del stack que se reserva para
este código, la closura es un bloque de memoria que se pone en el
stack al invocar este código, y el puntero es la dirección del código que
se debe ejecutar.

    struct Codigo.datos
      int tamaño_stack
      Valor[closure_size] closura
      int puntero

## Código Memoria

Igual que código, pero en vez de tener un puntero al código, tiene el código
representado en bytes dentro de la estructura. Esto no estoy muy seguro de
si incluirlo en serio.

    struct CodigoMemoria.datos
      int tamaño_stack
      Valor[closure_size] closura
      byte[code_size] instrucciones

## Módulo

Un módulo es un conjunto de clases, constantes, código y otros módulos bajo
un mismo nombre, la mayoría de las veces tienen algo que ver, pero esto
depende del creador del módulo.

    struct Modulo.datos
      Codigo init_code
      (String, Valor)[] constantes

# Módulos

Un módulo, en la máquina virtual,  es simplemente una tabla de clases, valores
y funciones que, generalmente, son las partes de una librería o programa, o
tienen algo en común. Los módulos son la forma de agrupar objetos para su uso
como constantes en el programa, de modo que el programa pueda tener la
funcionalidad separada por partes, o pueda importar el código de otros
desarrolladores.
