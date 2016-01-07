# Estilo Ruby

## Objetos

Los objetos Ruby están compuestos por una clase (y solo una) a la que
pertenecen, y una tabla con las variables de instancia del objeto. Los objetos
nativos de Ruby, aquellos que son instancias de tipos nativos (como números,
booleanos, clases etc.) tienen además datos adicionales sobre su valor. Pero
a pesar de eso, TODO en ruby es un objeto, solo que algunos son más
especializados por ser nativos, internamente pueden no tener la misma
estructura pero SIEMPRE se comportaran como objetos comunes y corrientes.

## Clases

Las clases en ruby también son objetos, además de la clase de la que son
instancia y las variables de instancia, las clases también tienen una tabla con
los métodos de la clase y una superclase (y solo una) de la que heredan.

## Métodos

A diferencia de otros lenguajes como Python o Javascript (no conozco smalltalk),
las variables de instancia no se pueden usar como métodos. Los métodos de un
objeto siempre están en la clase del objeto o en alguna superclase en la
ascendencia de la clase. Los métodos en una clase están en una tabla de métodos,
las variables de instancia de las clases tampoco se pueden usar como métodos
para las instancias de esa clase.

## Mixins

Los mixins son modulos (las clases también son módulos) que pueden ser
agregados a una clase. Los mixins toman prioridad sobre la superclase, y los
modulos agregados de último toman prioridad sobre los primeros. Los módulos
no pueden heredar de otras clases, lo que hace la cadena de clases
potencialmente más corta, tampoco pueden incluir otros mixins (creo), lo que
evita el problema del diamante. Lo que si tienen es colisión de nombres, pero
hay un orden de precedencia.

## Variables de Instancia

En Ruby las variables de instancia de un objeto son ocultas, el único lugar
de un programa en que se puede acceder a ellas es en los métodos de la clase
del objeto. El resto del programa solo puede enviar mensajes al objeto para
que decida qué hacer como responder a él. La expresión en ruby `x.var = y`,
es un azúcar sintáctico para `x.var=(y)`, se ve igual, pero "var=" es el
nombre del método que buscamos invocar en el objeto.

## Envío de mensajes

Cuando un objeto recibe un mensaje, Ruby empieza una búsqueda de método para
responder a él. Primero busca el método en la metaclase, luego, en la clase
normal, luego empieza a subir en la cadena de superclases de la clase del
objeto (los mixins están en esa cadena, justo después de la clase original).
Cuando llega al final de la cadena, si no ha conseguido el método, 
[[ Explicar aquí method_missing y demás ]], y si al final no lo consigue,
se rinde y lanza un error.

## Eigenclass

Cada objeto tiene una clase especial, única para ese objeto, que tiene
precedencia sobre la clase normal del objeto. A una instancia se le puede
definir métodos únicos para esa instancia, pero como había dicho, las variables
de instancia no se pueden usar como métodos, y si se agrega a la clase normal
el método sería visible para todas las demás instancias de la clase, así que se
agrega a la Eigenclass de la instancia, que es una clase cuya única instancia
es el objeto del que deriva.
