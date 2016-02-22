# Polimorfismo

Nota: Esta nota está basada en lo que he leído hasta ahora de este artículo http://www.cs.ox.ac.uk/jeremy.gibbons/publications/dgp.pdf

Existen varios tipos de polimorfismo que diferentes lenguajes implementan. Voy a hacer aquí un breve resumen y una comparasión de los que he visto.

Obvio estoy basándome en conocimiento que es bien sabido y he aprendido, nada lo estoy inventando, pero estoy organizando y nombrando los conceptos diferente a lo usual, para poder explicar más fácilmente mis ideas y conclusiones.

## Uso de parámetros

Una rutina describe una acción que el programa puede realizar, y una clase describe información de la que el programa tiene conocimiento. Voy a llamar
__Unidad__ a ambos conceptos, e "_invocar_ una unidad" significa ejecutar una rutina o instanciar una clase.

Muy frecuentemente, existen unidades que se comportan de un modo muy parecido con diferencias muy pequeñas. Por esta razón, los lenguajes tienen mecanismos para describirlas de un modo general, marcando solo las diferencias en cada uso específico. Estas diferencias, que se le hacen saber la unidad en cuestion, son los
__Parámetros__.

El tipo más común de parámetros son los valores, que son los que recibe una rutina para trabajar directamente con ellos. Los valores se crean y se trabaja con ellos en plena ejecución de un programa, porque el programa puede crearlos en base a valores anteriores, y algunos son los parámetros del programa en sí, que cambian cada vez que se ejecuta, por lo que no se pueden predecir antes de ejecutarse.

Esto no se considera polimorfismo porque es la manera básica en que se escriben programas, pero lo que quería ilustrar era el concepto de parámetros, porque es la manera en que se describe el polimorfismo.

## Necesidad del Polimorfismo

Un valor siempre necesita una clase para que el programa pueda saber cómo interpretarlo, porque al final un valor es simplemente un número en la memoria. Si un valor interpreta erroneamente, se pueden perder datos y todo el programa puede fallar. Para que eso no pase, el lenguaje fuerza al programa a siempre interpretar el mismo valor con la misma clase que tuvo desde un principio (Hay lenguajes que no lo hacen, se dice que son "_inseguros_").

Un lenguaje de tipado estático impone la seguridad haciendo que cada parámetro de una unidad exija una sola clase específica, y no permite invocarla con una clase diferente. Este comportamiento es a veces inconveniente cuando una unidad se comporta del mismo modo con cualquier clase, por ejemplo con una rutina para ordenar, o una clase para listas.

Este problema se soluciona dándole al lenguaje la capacidad de permitir el uso de valores de diferentes clases en el mismo lugar. Esta capacidad se llama
__Polimorfismo__. Hay muchas maneras de implementar polimorfismo, en nota trato de explicar y organizar los mecanismos de polimorfismo que conozco.

## Polimorfismo Dinámico

Los valores son creados con una clase. 

En los lenguajes dinámicos, las variables no tienen clases y las unidades reciben valores de cualquier clase. Sin embargo siguen siendo seguros. La clase de un valor esta guardada dentro del propio valor, así el lenguaje no se puede confundir