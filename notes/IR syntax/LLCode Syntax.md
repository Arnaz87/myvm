# LLCode Syntax

El código de Bajo Nivel (__LLCode__, de _Low Level Code_) es una sintaxis
especial para representar bytecodes de un modo un poco más facil de entender
para los humanos. Cada línea de código traduce a un bytecode específico
y viceversa.

En el bytecode no existen variables, solo existe un número de registros y se
accede a ellos como si fuesen un array, igual los argumentos.

El código de bajo nivel sí puede crear variables, símplemente crea un
diccionario con cada nombre de variable usado en el código y lo mapea a un
índice único en los registros. No se puede hacer lo mismo con los argumentos,
ellos se acceden como si fuesen un Array. Los nombres de variables son siempre
en minúsculas con palabras separadas con subguiones (ej: *snake_case*). Y los
argumentos se usan como si existiese un array Args (ej: *Args[0]*).

También se pueden crear labels con LLCode, para facilitar el uso de los goto.
Los labels funcionan como variables, simplemente es un diccionario mapeando
un nombre de label a un número de línea (o instrucción). Un nombre de label
es igual que el de variable pero predecido de dos puntos (ej: *:label_name*).
Para declarar un label solo se escribe su nombre en una línea para él solo,
y el traductor captura el número de la línea en que fue declarado.

El código de bajo nivel no puede crear un árbol sintáctico complejo, así que
los lugares en que se pueden usar las variables, operaciones, y argumentos
son muy limitados y específicos.

Una lista de todos los bytecodes y cómo se traducen a LLCode:
Aquí, un dólar seguido de un número indica, del lado izquierdo, un nombre de
variable o label, y del lado derecho, el valor al que la variable "mapea".
Un numeral seguido de un número en cambio, significa que lo que sea que esté
del lado izquierdo, va a decir lo mismo del lado derecho.

Las operaciones binarias siempre se aplican sobre dos variables y se guardan
en otra. La sintaxis de LLCode para todas las operaciones es
`$1 = $2 OP $3 => CODE $1 $2 $3`, donde _$1_ es la variable (o registro) en
donde se guarda el resultado, _$2_ y _$3_ son  respectivamente el primer y
segundo argumento de la operación, _OP_ es la operación en LLCode y _CODE_
es el bytecode al que está asociada la operación.

Una lista de los operadores binarios, sus bytecodes, y sus nombres:

* `+` => `add`: suma
* `-` => `sub`: resta
* `*` => `mul`: multiplicación
* `/` => `div`: división
* `%` => `mod`: módulo aritmético
* `**` => `pow`: potenciación
* `>>` => `right`: shift de bits a la derecha
* `<<` => `left` : shift de bits a la izquierda
* `|` => `or` : puerta OR  (binaria y lógica)
* `&` => `and`: puerta AND (binaria y lógica)
* `^` => `xor`: puerta XOR (binaria y lógica)
* `<`  => `lt`  : menor qué
* `<=` => `lteq`: menor o igual qué
* `==` => `eq`  : igual qué
* `!=` => `neq` : diferente de

Nota: la multiplicación se llama "mul" en vez de "mult" para que sea
consistente con el resto de las operaciones con nombres de 3 letras.

Las siguientes traducen a `CODE $1 $3 $2`, es decir, invierten los argumentos.

* `>`  => `lt`  : mayor qué
* `>=` => `lteq`: mayor o igual qué

La siguiente es una lista del resto de las instrucciones posibles:

* `$1 =  $2` => `copy $1 $2`
* `$1 = -$2` => `neg $1 $2`
* `$1 = !$2` => `not $1 $2`
* `$1 = Args[#2]` => `getarg $1 #2`
* `Args[#2] = $1` => `setarg $1 #2`
* `$1()` => `call $1`
* `@tail $1()` => `tailcall $1`

En estos 3, $1 es un label, no una variable

* `goto $1` => `goto $1`
* `goto $1 if $2` => `gotoif $1 $2`
* `goto $1 ifnot $2` => `gotoifn $1 $2`


