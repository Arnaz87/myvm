# Lua Implementation

Una implementación de Lua para probar las características de la máquina virtual.

Para correr la implementación, ejecutar "test.js" en Node JS. El script lee el
contenido de "test.lua" y escribe los datos que logró sacar en "test.json",
esos son los tokens, el arbol de sintaxis (AST) y el bytecode (en el formato
del interprete de prueba, que es una lista con las instrucciones)

Uso estas referencias para la sintaxis de Lua:

* http://www.lua.org/manual/5.1/manual.html#8 (EBNF oficial de Lua 5.1)
* http://www.lua.org/manual/5.1/es/manual.html (La versión en español)

No uso Lua 5.3 porque añade muchas cosas que me parecen innecesarias

# Estado del proyecto

Ya podía generar bytecodes, pero el lenguaje era muy diferente a lua y muy
inferior. Estoy trabajando en hacer un Lua más fiel (y va bien), por eso
desactivé la generación de código hasta que termine un parser que soporte
gramática relativamente parecida a Lua (mi criterio personal).

Ahora debo trabajar en el parser para funciones.

## Lexer

El lexer ejecuta todos los tipos de tokens y selecciona el resultado más largo.
Si tiene "els", "else" y "elsex", los interpreta correctamente como variable,
palabra clave y variable, respectivamente. "....." resulta en un vararg seguido
de una concatenación, y ".. ...." resulta en una concatenación, seguido de
vararg, seguido de un punto gramático.

## Parser

* Soporta literales de strings, números, nil, false, true, y varargs (...).
En el proyecto les digo "constantes".
* Soporte completo de expresiones aritméticas binarias, con precedencia de
operadores. Todos los operadores asocian a la izquierda (exponenciación y
concatenación deberían asociar a la derecha).
* Falta buen soporte de operadores unarios, los que están no respetan
precedencia, y están implementados en el parser de átomos, debería estar en
el de expresiones aritméticas. Está desactivado por ahora. No es prioridad.
* Como Lua es de tipado dinámico, para el parser todas las variables son
tablas, funciones y números a la vez (igual que el Lua real).
* Puede acceder a campos de tablas e invocar funciones. En la sintaxis de Lua
ambas acciones son recursivas y dependientes entre sí, así que tuve que hacer
ambos en la misma operación. Para diferenciar una invocación de un acceso a
campo hay que revisar el tipo del resultado de ese módulo.
* Por la razón de arriba, no puedo separar las sentencias de asignación y la
de invocación de función, así que tuve que hacer el mismo parser que considere
ambos tipos a la vez. Al fin y al cabo ambos son sentencias así que no es mucho
problema tampoco.
* Soporta las sentencias de control de flujo if (sin elseif), while y for
numérico. Faltan repeat, do y for genérico.
* Tiene las sentencias return y break, por la sintaxis de lua solo es legal
ponerlo al final de un bloque.
* Soporta funciones, con nombres y anónimas. "function x (a) b end" traduce a
"x = function (a) b end" en el árbol sintáctico.
* Puede construir objetos con las sintaxis para lista {1,2,3}, la común
{a=1,b=2}, la de campos {[5+2]=7,[foo()]=bar()} y mixta.

* Faltan scopes para asignación de variables.
* Lua oficial puede usar expresiones entre paréntesis como objetos, se pueden
ejecutar y se pueden acceder a campos de ellas, pero no deja asignarlas como
variables. Esta versión no permite hacer eso, fue dificil de implementar. Eso
quiere decir que no puedo concatenar dos strings y luego acceder a sus
caracteres, solo se puede si antes guardo el string resultante en una variable.


## Compilador

Soporta:

* Puede compilar todas las expresiones aritméticas y lógicas (las unarias no,
tampoco las no aritméticas como concatenación o las de bits)
* Llamado de funciones con argumentos, tanto en sentencias como en expresiones.
* Solo se puede usar el primer resultado de una función expresión.
* Puede asignar variables y asignar campos de objetos.
* Leer y asignar campos de objetos.

Falta:

* Control de flujo
* Definición de funciones
* Creación de objetos
