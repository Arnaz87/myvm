# Implementación JS

Esta es una pequeña implementación de prueba de la máquina virtual, hecha en
Javascript por la facilidad de programar en él y por su versatilidad en cuanto
a dónde puede correr. Más por la primera razón, porque es completamente
dinámico, basado en diccionarios y en prototipos, lo que hace que se pueda
implementar extremadamente rápido, a diferencia de C o C++.

La implementación, sin embargo, es extremadamente lenta. Hice la prueba e
implementé multiplicación en términos de las instrucciones "inc" y "dec", y
multiplicar 5*10 toma alrededor de 2 segundos, y 1+1000 alrededor de 6.

También es diferente a la especificación de la máquina virtual, la más notoria
es que los registros pueden tener nombre, pero también varias más que voy a
listar después más abajo.

## Parser

Uno de mis objetivos con esta implementación es crear un parser para la
sintaxis de los módulos, porque por ahora hay que construir los módulos en
código javascript, usando objetos y arrays.

## Lua

También quiero implementar un compilador de Lua a la máquina virtual.

## Diferencias a la especificación

Tengo que listarlas y eso...