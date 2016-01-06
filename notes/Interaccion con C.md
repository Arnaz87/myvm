# Metodos Nativos

La máquina virtual tiene un stack de punteros a funciones C, las extensiones,
los programas nativos, y la misma máquina virtual, pueden registrar funciones
y se añaden al stack. El programa interpretado tiene acceso a este por medio
de un tipo de valor: _Función Nativa_, que es un índice a algún punto del
stack, y con la instrucción _call_ se le pide a la máquina virtual que la
ejecute. La función nativa puede interactuar con el código interpretado y
viceversa usando el stack de argumentos.

El sólo hecho de registrar una función en el stack no le da acceso al código
a esa función, porque no puede crear valores de la nada, el programa nativo
debe crear un valor para la función y asignarlo a algún objeto del heap o a
un módulo, la máquina virtual debe exponer un api para todo eso.

# Objetos Nativos

Del mismo modo, la máquina virtual puede tener un stack de objetos nativos.
A diferencia de las funciones, que tienen los mismos tipos y parámetros,
estos no pueden ser punteros simples, deben tener también un tipo ya que un
objeto binario puede ser cualquier cosa. El lenguaje C tiene las variables
tipadas y sabe qué representa cada puntero, pero una vez que entra a la máquina
virtual, esta información se pierde.