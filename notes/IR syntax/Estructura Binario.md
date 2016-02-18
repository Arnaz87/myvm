# Estructura para formato binario

Todo el archivo en Bigendian, porque es el Endianess estándar para la web.

## [2016-02-17 09:00] Versión binaria

La primera codificación que se me ocurrió. La mayor influencia en esta es el formato de clase de Java.

Esta es una lista con el significado de cada byte del archivo. Cada sección aquí empieza donde terminó la sección anterior, y se especifica su largo. Solo las de longitud variable indican su tamaño en el archivo, menos el número mágico, ese tiene un tamaño predefinido que la máquina virtual conoce, solo que depende del nombre que se haya elegido.

- __MAGIC__: ASCII para el nombre de la máquina virtual. por ahora es "PALO".
- __VERSION__: El número de versión mayor en hexadecimal, debe llenar hasta el octavo byte, por ejemplo, si el nombre es "PALO", ocupa 4 bytes, así que la versión también debe ocupar 4 para llegar a 8: "0001". Si empieza con "X" es una versión no oficial. Es muy poco probable que se use más de el primer dígito.
- __MEDIUM__: El número de versión medio en binario, formato u16.
- __MINOR__: El número de versión menor, formato u16. Mayor o igual a 0x8000 significa Prerelease.

En este punto deben haberse usado 12 bytes. De aquí en adelante está la información real del archivo.

- __Descripción__: Descripción del módulo, aquí va el nombre, autor, versión y descripción, lenguaje, etc. El único obligatorio es el nombre.

## [2016-02-17 13:36] Versión ASCII

Esta idea se me ocurrió porque, haciendo la versión binaria, no supe cómo codificar la parte de la descripción. En esta versión, toda la información del formato del archivo, y la información general del módulo, está en ASCII.

La primera sección es la versión del archivo, cada parte está separada con '.' (punto). Empieza con el nombre de la máquina virtual en mayúscula, luego la versión mayor, y luego cada una de las versiones menores. El nombre de la máquina más el punto funcionan como número mágico. La versión mayor, si es Prerelease, empieza con guión, debe ser el nombre en ascii. Cada una de as secciones numéricas debe ser en hexadecimal. Si es una versión de la máquina especial o no oficial, la primera parte debe ser el nombre de esa versión, y luego se puede seguir cualquier esquema que use la versión, siempre y cuando no se use la nueva línea, porque termina la sección. Ejemplos:
"PALO.2.8.B", "PALO.-1.4.5", "PALO.1.F.F.AB.3D", "PALO.Canaima.locoloco-123".

La sección termina con '\n' (Nueva Línea ASCII).

Luego viene la sección de descripción. Los pares están separados con la nueva línea ASCII. Cada par tiene un nombre y un valor, ambos son cualquier secuencia de caracteres UTF8 excepto '=' y '\n' (dos puntos y nueva línea). El '=' separa el nombre del valor, y el '\n' separa cada par. Las secuencias pueden tener las secuencias especiales "\n" y "\=". Un módulo puede tener todos los pares que desee. 'name' no es el nombre para importar el módulo, es solo un nombre descrpitivo, la máquina virtual puede usarlo, así como a 'version' y 'author' para separar módulos con nombres ambiguos, pero no son obligatorios. Otros nombres útiles pueden ser 'description', 'language', 'creation', 'status', 'website', 'email'.

Dos nuevas líneas seguidas indican el fin de esta sección.

La siguiente línea es el nombre del módulo. Un nombre de módulo puede usar '_' para separar palabras, '.' para separar grupos, cualquier caracter ASCII alfanumérico, y cualquier caracter UTF8 que no sea ASCII. Diferentes lenguajes usan diferentes símbolos para separar entre palabras y entre jerarquías de módulos, se espera que traduzcan esos símbolos a los que usa la máquina virtual. También se espera que usen doble guión bajo '\_\_' para codificar caracteres especiales.

La siguiente línea son las dependencias. Están separadas por la nueva línea. Una dependencia es un nombre de módulo, y puede estar seguido de ':A' y un texto para indicar un autor, ':V' para indicar versión, y ':N' para indicar un nombre extendido. Son opcionales, se usan para evitar ambiguedad entre nombres de módulos, y para evitar el "Infierno de dependencias" (cuando un programa depende de otro pero usa uno de versión diferente, potencialmente incompatible).

La siguiente doble linea nueva indica el fin de esta sección.

La siguiente sección son las constantes exportadas. Es otro diccionario. Del lado izquierdo del ':' está el índice de la constante (explico más adelante) y del lado derecho el nombre de la variable

Gramática tipo BNF completa:
    
    <module>  := <version> '\n' <description> '\n'
                 <name> '\n' <dependencies> '\n'
    <version> := <magic> '.' (['-'] <hex> { '.' <hex> } | <custom> )
    <hex> := /[0-9A-F]+/
    <custom>  := /[^\n]+/
    <description> := {<pair>}
    <pair> := <str> '=' <str>
    <str>  := /([^;\n]|\\[^\n])+/
    <module> := /[a-zA-Z0-9._\u0080-\uffff]+/
    <name> := <module>
    <dependencies> := {<module> [':A' <str>] [':V' <str>] [':N' <str>] '\n'}

## [2016-02-17 16:0] Datos del módulo

El módulo es una lista de constantes, y una de ellas es el módulo en sí, indicando cuáles de esas constantes son visibles para los otros módulos.

## [2016-02-18 13:12] Constantes

El módulo declara constantes, que luego podrán usarse en las definiciones. Las constantes son cosas como Clases, Strings, Números, que se usarán muchas veces y no deben cambiar con el tiempo, o que la máquina virtual usa. Aquí se incluyen las clases y traits de las variables de las funciones, y los nombres también.

