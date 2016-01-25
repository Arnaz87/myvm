# Coercion en los operadores

Cada lenguaje de programación maneja diferente el comportamiento de los tipos
con las operaciones básicas, por ejemplo con la suma (+). Si hay una variable
_i_ que es un número entero, y _s_ que es un string y se suman en diferentes
lenguajes: Lua trata de leer un número de _s_ y si no puede falla, Javascript
convierte el número en un string y luego concatena los dos strings resultantes.
Crear un mecanismo que pueda tomar en cuenta cada comportamiento simple y
eficientemente es demasiado complicado, así que voy a implementar un
comportamiento base más cercano a un lenguaje compilado que a uno interpretado.

Los operadores solo funcionan con dos registros del mismo tipo o trait, y que
el tipo de los registros se sepa en compilación. Ya que una variable solo puede
tener un tipo o trait asociado, no hay problemas de ambiguedad y no hay que
establecer precedencias.

Las operaciones aritméticas básicas (sumar, restar, multiplicar, dividir)
aceptan los tipos float e int, y los traits Integer y Floating, los traits
para que precisamente, conviertan el objeto a int o float nativos. 

Las operaciones a enteros (shift, not and or binarios, modulo) solo aceptan
el tipo int y el trait Integer.

Las operaciones lógicas aceptan bool, Boolean y Boolval.

## Más complicados

Para esquemas de coerción más complicados se puede simplemente crear una
función que se encargue de convertir tipos y se llama esa función en vez de
usar la instrucción para eso.