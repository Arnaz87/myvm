# Máquina Virtual

Quiero crear una Máquina Virtual, para poder desarrollar desde cualquier
entorno de desarrollo que se ejecute sin problemas en cualquier plataforma.
Pero tiene que ser pequeña, para poder integrarse en muchos sitios, y muy
flexible, para que cualquier tipo de lenguaje de programación pueda ser
implementado y corra con una buena velocidad, que esté optimizado para la
mayor cantidad de paradigmas posibles, como imperativo, funcional, lógico,
orientado a objetos, prototipado, dinámico, estático, etc. y que tenga la
opcion de que programas y lenguajes puedan diseñarse para correr con buena
velocidad, como los lenguajes de tipado fuerte.

En pocas palabras, una máquina virtual ligera, veloz, y muy versátil.

## Proyectos Similares e Influencias

* JVM: La máquina virtual de java es multiplataforma, pero no es ligera y no
está diseñada exactamente para ser versátil, aunque hay muchos lenguajes muy
diferentes implementados para la JVM, pero se han implementado con algunos trucos
para hacerlos funcionar en esa arquitectura, y es hasta las últimas versiones
de la Máquina Virtual que están añadiendo instrucciones nativas para métodos
dinámicos, que es obviamente necesario para ejecutar lenguajes dinámicos con
buena velocidad.

* CLI: CLI es otra especificación de una infraestructura virtual, muy parecida
a la JVM, pero a diferencia de esta, está mucho mejor diseñada para ser
versátil en cuanto a los paradigmas que se pueden implementar en ella. Pero
no es mucho más ligera que la JVM, y el principal problema, la implementación
oficial y la única estable es .NET de Microsoft, y no es multiplataforma.
Otras implementaciones que sí son multiplataformas como Mono tienen algunos
problemas de compatibilidad con programas hechos para .NET. Pero lo más
importante, Odio a Microsoft, así que automáticamente CLI no sirve para nada.

* Parrot: Parrot es una máquina virtual diseñada para la ejecución eficiente
de lenguajes dinámicos, nació de la comunidad de Perl. Por ser diseñada para
lenguajes dinámicos es bastante versátil, y por ser solo una especificación
es multiplataforma, pero el problema con Parrot es que no es exactamente
ligera, definitivamente lo es más que JVM o .NET, pero crear una implementación
de Parrot no es fácil porque la especificación es algo compleja. Es hasta ahora
la que más se acerca a lo que quiero, pero no lo es lo suficiente.

* Lua: Lua es un lenguaje, no una plataforma o una máquina virtual, sin embargo,
la implementación oficial de Lua usa una, y es a esa a la que me refiero.
Esta diseñada para Lua, que solo tiene de tipos de datos Booleanas, Números,
Strings y Tablas, y está optimizada (porque el lenguaje lo requiere) para ser
muy muy simple y pequeña, y a pesar de eso ejecuta programas de Lua con muy
buena velocidad. El problema con esta máquina es precisamente el contrario a
las demás, cumple casi todos los requerimientos pero es demasiado ligera, y
no es suficientemente versátil como para permitirle a programas optimizados
correr con buena velocidad, por ejemplo por ser las tablas el único tipo de
dato, es imposible hacer static binding o dispatch.

* Smalltalk: Smalltalk fue el primer lenguaje en implementarse con una máquina
virtual y bytecodes, solo cumple lo de multiplataforma y en cierta medida lo
de sencillez, pero no mucho. Lo más importante es usa varias ideas interesantes
que van a influenciar mi máquina virtual

* Mips: Mips es una arquitectura de CPU Real, no una máquina virtual, pero se
puede aprender mucho de arquitecturas reales. Elegí mips porque parece ser la
más simple y popular, más que ARM (x86 es la más popular, pero su simplicidad,
por supuesto, está fuera de discusión)

* LLVM: de Light Level Virtual Machine, es una arquitectura virtual diseñada
para asemejarse mucho a las arquitecturas de CPU reales, pero abstrayendo
las diferencias entre ellas. Está creada para ser una representación intermedia
entre un lenguaje y la arquitectura real objetivo. La elegí básicamente por las
mismas razones que Mips, no es una máquina virtual en la que correr programas
pero por el hecho de ser muy similar a arquitecturas reales de CPU, se puede
aprender mucho de ella, más aún si ya se hizo el trabajo de abstraer las
diferencias entre arquitecturas reales.


# Entorno

También quiero un entorno de ejcución completo, con baterías incluidas, con
un framework de desarrollo, manejo de programas y dependencias, e incluso que
funcione como navegador de internet para programas de la plataforma.
Esto es un proyecto separado de la máquina virtual, pero corre sobre esta, es
como la maquina virtual en esteroides.

Tiene que ser una lista de librerías con funciones usadas frecuentemente, como
las librerías estándar de Python, si se puede hacer más completo, como el
Framework de Java o .Net sin aumentar demasiado el tamaño y complejidad,
entonces dele. También es importante que los programas (o módulos) puedan
declarar dependencias, de modo  que la plataforma se haga cargo. Para eso debe
tener una lista de módulos instalados y conexión con un repositorio central,
para descargar las que hagan falta (a la Ruby Version Manager). Entonces las
dependencias se cargarían antes de procesar el contenido del módulo, y del
mismo modo se cargan las dependencias de estas dependencias. Además de un
repositorio principal, también debe poder descargar modulos desde una url de
internet para las dependencias. Esto mismo se puede aprovechar y usar modulos
como si fueran aplicaciones web completas, sin necesidad de descargarlos e
instalarlos, esto es parte de los objetivos secundarios que tengo en mente, no
es solo una casualidad.

## Proyectos Similares e Influencias

* Java Framework
* .Net Framework
* Python Standard Library
* Smalltalk Environment
* Web (Toda la plataforma web, javascript, html, etc.)
* Ruby Version Manager
* apt-get, yum

Las principales son Web y Java Framework