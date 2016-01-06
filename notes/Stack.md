# Stack

El stack es el que actúa como registro para las funciones.

    Vm_Stack:
      int size  # Tamaño del Stack
      int free_i  # Primer Valor libre
      Value[size] data  # Array de Values

Cuando una función se ejecuta, pide un espacio del stack para usarlo como
registros, por defecto es 32 de tamaño, pero puede extenderse hasta 256 o
preferiblemente menos.

    Vm_Stack.get (int nsize)
      nstack = (&data + free_i)
      free_i += nsize
      return nstack
    function.stack = Vm_Stack.get(function.stacksize)

Y cuando termina la ejecución libera el espacio del stack que se había usado

    Vm_Stack.free (int nsize)
      free_i -= nsize
    Vm_Stack.free(function.stacksize)

En el código el stack no se comporta como tal, sino como registros, se puede
acceder a cualquier Valor que esté dentro de él, no solo al tope. La única
referencia a un registro está en las instrucciones, lo que significa que se
puede asegurar que no haya acceso a algun registro fuera del stack sin
necesidad de ejecutar código.
Cuando una función pide espacio del stack pero no hay suficiente, se lanza un
error Stack Overflow.

El stack no se limpia cuando se entrega a una función o cuando se libera, es
resposabilidad del programa asegurarse de que los registros tengan significado
antes de usarlos. Los primeros registros sí se llenan con los argumentos de la
invocación de la función, siendo el primero de todos 

# Heap

El Heap es un espacio de la memoria que guarda los objetos del programa, todas
las funciones e hilos de un programa tienen acceso al mismo heap, pero
diferentes programas (por defecto) tienen sus propios heaps.

# Ejecución de funciones

Las funciones son objetos que existen en el Heap, están armadas algo así:

    Funcion:
      Objeto* meta      # Datos de esta función
      [Valor]* closure  # Clausura del código
      [byte] code       # Código crudo para ejecutar

Meta es un objeto externo, ahí contiene la información adicional, no
prescindible de la función, como número de argumentos, tipos de los argumentos,
si ya está compilada, etc. Aunque en otros lenguajes estos datos pueden ser
imprescindibles, en la máquina virtual no lo son, porque está diseñada de
forma muy dinámica, aunque puede servir para poner restricciones de seguridad
o para optimizar el código. Closure son las variables locales de la función,
las que deben permanecer entre ejecuciones de la misma función.

El procedimiento de ejecución de funciones es así:
La máquina virtual recibe una referencia al objeto función que va a ejecutar y
trabaja con este objeto de aquí en adelante. La máquina reserva un pedazo del
stack para la función y se la entrega, el tamaño del stack debe estár en un
valor Meta, si no, usa un tamaño predeterminado (32, si la función es muy
compleja puede pedir más, y si no, puede pedir mucho menos para no
sobrecargarla), o puede también revisar el mayor registro usado por la función
y le un tamaño acorde. Si la función fue llamada con tailcall, antes de
reservar más espacio, libera el de la función anterior.
Los argumentos que haya recibido la función se copian al principio del stack.
Luego se empieza a ejecutar cada instrucción del código. La máquina virtual es
libre de hacer algunas preparaciones adicionales al código antes de ejecutarlo,
como convertir referencias a modulos de string a objetos (Esto lo explico en
más detalles en el artículo de los módulos), o asegurar los tipos de las
variables y valores de otras funciones, o enlinear llamados a funciones
pequeñas. La máquina virtual puede o no copiar las funciones a un espacio de
memoria especial para ellas, y puede o no modificarlas, así estén en el Heap,
al ejecutarlas o al cargarlas, por eso no se debería modificar o leer el
contenido de las funciones después de creadas, no hay ninguna garantía con
respecto a ellas, la única garantía es que sí el programa las modifica deben
ser funcionalmente equivalentes a lo que se cargó.

Las instrucciones para ejecutar funciones son:
call A B C D: llama la función A, con los árgumentos en R(B) hasta R(B+C), y
los valores de retorno se ponen en R(B) hasta R(B+D).
tailcall A B C D: Igual que call, pero en vez de crear un nuevo stack,
remplaza el actual.
msg A B C: Enjecuta el Método especial D del trait C del objeto R(A) con
argumentos desde R(B) y valores retornados a  R(B). Los métodos especiales
son como funciones comunes, pero la cantidad de argumentos y de valores
devueltos está predefinido.
getmsg A B C D: En vez de ejecutar el método especial, se trae una referencia
del método D en el trait C del objeto en R(A) y la pone en R(B)

# Stack de argumentos

Estoy pensando que puede ser mejor hacer un Stack separado para los argumentos
y valores de retorno de las funciones. Sí, definitivamente será mejor, mucho
más simple de manejar.

Cuando un programa llame a una función, tiene que poner los parámtros en ese
registro, y cuando una función termina, pone los resultados en el mismo stack,
y el programa que la llamó puede leer acceder al stack para obtener los resultados.

Instrucciones nuevas:
call A: Llama la función en R(A)
tailcall A: Llama la función en R(A), pero en vez de crear un nuevo stack,
remplaza el actual.
msg A B: Llama el método especial B en el objeto R(A)
getmsg A B C: Selecciona la función del método especial B de R(A) y la pone en
R(C)

msg A B, es básicamente 'getmsg A B X, call X'.

# Metodos de Traits

Los métodos de traits son los que indican un Método de un Trait (Dah). Son
importantes porque de algún modo hay que pasarlos como argumento a la
instrucción `msg`, y tienen que tener codificados qué Trait usar y cuál
método usar de ese Trait.

Un programa no siempre (de hecho, a menos que sea nativo, casi nunca) tiene
el id del trait que quiere usar (pero sí el id del método), porque los traits
se pueden usar como clases y hay muchas clases potenciales, por lo que es
imposible garantizar que un trait siempre tenga el mismo id. Por ello, el id
de un trait debe resolverse al cargar o compilar el programa. Esto no nos
permite codificar un método en el bytecode.

Tampoco pueden andar por ahí en el programa, por eso, no se pueden implementar
como valores resueltos en compilación como lo hacen las clases en sí, porque
de ese modo pueden pasarse a funciones, devolverse de ellas, y guardarse en
otros objetos, lo cuál está bien con las clases y con los objetos funciones,
pero no con los métodos de trait. Esta razón también descarta guardarlos como
objetos, que de hecho es mucho peor.

No me gusta mucho la idea de crear todo un mecanismo aparte solo para los
métodos, si se puede debería usar un mecanismo ya existente, o que el nuevo
mecanismo sea suficientemente versátil y se pueda hacer más cosas con él.

Podría ser usar dos argumentos en el bytecode, el primero una clase constante,
y el segundo, el id del método.


