# Lua Implementation

Una implementación de Lua para probar las características de la máquina virtual.

Para correr la implementación, ejecutar "test.js" en Node JS. El script lee el
contenido de "input.txt" y escribe los datos que logró sacar, esos son los
tokens, el arbol de sintaxis (AST) y el bytecode (en el formato del interprete
de prueba, que es una lista json con las instrucciones)

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
de una concatenación y ".. ..." en lo contrario.

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
* Soporta las sentencias de control de flujo if (faltan los elseif) y while.
Faltan repeat, do y ambos for, el numérico y el iterador.

* Faltan scopes para asignación de variables.
* Falta definición de funciones, ambas, anónimas y con nombre. Esta es la
prioridad ahorita.

* No entiendo las sentencias return y break, segun la referencia solo pueden
aparecer como última sentencia en un bloque... ¿break solo al final de un bloque?
DAFUQ! Qué pinche sentido tiene eso?
* . . . en realidad ya entiendo, un bloque es un if o un while, no tiene mucho
sentido poner un return en medio de una secuencia de instrucciones e ignorar
todas las que están por delante, solo tiene sentido si se puede obviar la
sentencia de algun modo, como con un if, que en ese caso estaría al final del
bloque del if pero no al final de la función necesariamente.


## Compilador

Por ahora está desactivado para avanzar el parser hasta el punto en que esté
satisfecho.

    