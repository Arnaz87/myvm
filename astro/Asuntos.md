# Asuntos con Astro...

Vale destacar que con este lenguaje, mis prioridades son: Conceptos simples y Sintaxis intuitiva. Aunque me gustan mucho la sintaxis regular y la sintaxis flexible, es más bien objetivos secundarios en este lenguaje.

Inspiraciones del lenguaje, en orden de importancia.
Semántica: Lua, Javascript, Io, Ruby
Gramática: Coffeescript, Ruby, Lua, Haskell

## Sintaxis de invocación sin paréntesis:

Asumiendo que f toma 2 argumentos, g toma 1, h toma 1 y devuelve función de 1, e toma 0 argumentos, j es una función arbitraria que quiero usar.

Voy a asumir esto por el resto del documento.

*Alterno abajo significa que es válido en Ruby y Coffee, pero no es normal.

- `e` Haskell, Ruby
- `e()` Coffee

- `f a b` Haskell
- `f a, b` Ruby, Coffee

- `f g(a), b` Ruby, Coffee
- `f (g a), b` Alterno
- `f (g a) b` Haskell

- `g f(a b)` Ruby
- `g f a, b` Coffee
- `g (f a, b)` Alterno
- `g (f a b)` Haskell

- `g g a` Coffee
- `g g(a)` Ruby
- `g (g a)` Haskell, Alterno

- `(h g) a` Haskell, Coffee
- `h g a` Smalltalk (Smalltalk Hipstersote!)

Por ahora la que más me gusta es Alterno, Haskell es cool pero da problemas en casos como `f 1+2 -4*5 (WTF!)`.

## Objeto vs Bloque

La sintaxis para crear un objeto es `{x=1,y=2}`, y para crear un bloque para que lo use if o while, uso `{do_sumthing; carro.run}`. El problema: qué pasa si tengo `{a=1}`. Es eso un bloque o un objeto?
Aquí `x = {a=1}` podría asumir que es un objeto, y aquí `if true {x=2}` lo más probable es que sea un bloque, pero también podría ser un objeto.

La solución que se me ocurrió es que los bloques de una expresión son ilegales, así puedo saber cuándo se usa ';' o ',' como separador, y si no se usa asumo que es un objeto. Pero no me gusta porque restrigne un poco la sintaxis.

## Extracción de campos

Hay dos problemas, primero: Las funciones son automáticas, se llaman solas. Si un objeto 'carro' tiene un campo 'correr' y es una función, `carro.correr` ejecutará la función automáticamente. Pero qué si quiero acceder a la función en sí, en vez de ejecutarla?

El otro es que si un objeto implementa el campo especial '_get', entonces cuando use `carro.correr`, ejecutará esa función especial. Qué pasa si quiero acceder al campo real?

Tenía pensada la sintaxis `carro.&correr`, pero tengo que pensarlo bien porque también la uso para el siguiente punto.

Por si lo cambiaba, también se me ocurrió usar `carro:correr`, y me gusta bastante la verdad.

Por todo lo que he hablado más abajo, el operador de acceso a campos será ':'

## Uso de funciones como objetos

Con una función `inc = (x)->x+1`, puedo usar `inc 5` y funciona como debe, ejecutando la función. Pero que pasa cuando quiero usar esa función como objeto y pasarla a funciones o asignarla a algo?
`inc_b = inc` no funciona porque ejecuta inc automáticamente (y da error por falta de argumentos), o con `arr.map inc` pasa lo mismo.

La solución que se me ocurrió fue un operador '&' de encajar funciones. Pero terminó siendo un poco confuso. Me gusta la idea pero tengo que pulirla mucho más para que sea más usable. Un intento de explicarlo está en el otro documento "funciones creo.txt"

## Campo o Array

Como la invocación de funciones no requiere parámetros, podemos pasar un array a una función así `fun [1, 2]`, pero la sintaxis de acceso de campos hace conflicto `arr[1]`, entonces cómo separarlo?

Una solución que se me ocurrrió fue mezclar la sintaxis de objetos y la de arrays, de modo que se use `{1,2}` para un array.

No sé si esto implicaría unificar los conceptos como en lua, o si simplemente separarla de el literal de objeto: `{a=1,b=2}`, nótese que los campos de los objetos tienen nobmre y los de los arrays no.

Otra solución que encontré es la que usa Coffee, si hay un espacio `fun [1]` es una invocación, pero si no tiene `arr[1]` es un acceso.

## Aplicación parcial

Me gusta el Currying de haskell, lo quiero en mi lenguaje!

Hacer currying con la sintaxis actual es fácil: `(y)-> f x y` (asumiendo que ya teníamos x), pero se me ocurrió la idea de una sintaxis más simple para esto: `&(f x)`, deriva del operador de encajar funciones pero es diferente.

Como se puede observar es mucho más compacta y sencilla de trabajar. El ejemplo traduce a `(*args) -> f x, *args` (Véase Encajar Argumentos para el operador '*').

Esto de la aplicación parcial tiene otras ventajas: asumiendo f que es un método de un objeto y recibe dos argumentos:

- `&(obj.f)` Aplicación nula, extrae el método, parecido a `obj:f` pero captura el contexto, o sea, mantiene el dueño de la función
- `&(obj.f x)` Aplicación parcial común, nada especial
- `&(obj.f x, y)` Aplicación total, parece evaluación perezosa. Esto devuelve una función pura así que se invocará automáticamente.

Dato: Esta idea de sintaxis para aplicación parcial no se me ocurrió para currying, lo pensé porque quería extraer objetos funciones pero manteniendo el contexto, es decir, extraer ún método en vez de una función. Luego fue que se me ocurrió usar la sintaxis para Currying.

## Encajar Argumentos

Inspirado en ruby. Sirve para convertir arrays en argumentos dinámicos y viceversa. Una función `(f, *args)-> f args` puede recibir cualquier número de argumentos, el primero siempre será 'f', y todos los demás son agrupados en el array 'args', por lo tanto `call f, a`, `call f, a, b, c` y `call f` son todos válidos. Del mismo modo, si tengo un array puedo pasarlo como argumento dinámico, ej: `call f, *[a, b]` equivale a `call f, a, b`, y `call f. *[]` equivale a `call f`.

En Astro, se pueden devolver varios valores de las funciones. Normalmente el lenguaje devuelve la última expresión en ejecutarse, pero para devolver varios valores hace falta usar un return explícito y los valores separados por coma (Esto en realidad no está decidido, pero voy a asumir que es así, véase el siguiente punto). El caso es que, si se tiene un array, se puede devolver todo su contenido por separado al igual que se llama una función:
`return 1, 2, *arr`

## Retorno múltiple

Este asunto surgió pensando en el encaje de argumentos. Como en Lua, en Astro se puede hacer asignación múltiple: `a,b = 1,2`. Las funciones pueden devolver varios argumentos y ser asignados, como en Lua: `a,b = f`, más complejo, mezclando expresiones simples con funciones: `a,b,c,d = 1, g, f`, suponiendo que g devuelve 1 valor y f 2, quedaría `a = 1; b = g; c,d = f`.

Pero el problema, si tengo una función, y quiero que devuelva varios argumentos, qué sintaxis utilizo?

Idea 1: para devolver varios argumentos se usa un `return explícito`. Pero en oneliners, usando `f ()->return a, b` hay dos opciones: la primera es que f recibe un "lambda que bota a", y a "b", y la otra es que el lambda devuelve ambos a y b, y f toma ese lambda como único argumento. Como es ambiguo, lo mejor sería encerrarlo en paréntesis, el cual tiene también muchas formas posibles: `f (()->return a, b), c`, `f ()->(return a, b), c` y
`f ()->{return a, b}, c`, lo cual me llevó a la segunda idea

Idea 2: se usaría `f ()->(a,b), c` o `f ()->{a,b}, c`. La primera indica que una lista de expresiones es una expresión en sí, y puede (o debe) estar entre paréntesis. La segunda es más clara en decir que es un bloque, pero ahora se confunde con un Array, si es que va a usar esa sintaxis.

Idea 3: otra opción es que no haya sintaxis para ello, lo único que se puede hacer es usar directamente cajas de argumentos: `f ()->*[a,b], c`. No me gusta esta idea.

Me gusta mucho más la segunda idea, pero tengo que elegir alguna variación y pensarlo bien en general...

## Encajar Funciones. Revisitado

En fin, tratando de simplificar esto, el operador '&' encaja y desencaja funciones. Un pequeño ejemplo con su funcionamiento:

    fun = (x)->x+1  # fun es una función pura
    res = fun   # Se invoca automáticamente, res guarda el resultado
    box = &fun  # Se aplicó el operador a una función pura, así que se encaja
    bux = box   # Guarda lo mismo, box es una caja y no se invoca sola
    fon = &&fun # Confuso
    # Esto es para usar fun como función pura pero sin invocarla.
    # En este, fun es una función pura, &fun encaja la función, convirtiéndola 
    # en variable común, y &&fun vuelve a desencajar la función, convirtiéndola
    # en una función pura.
    ros = fon   # fon es una función pura, se invoca sola.
    bax = &&box # Me imagino que esto es una caja normal
    # Siguiendo la otra lógica, box es una caja, &box es pura pero &&box es 
    # una caja otra vez.
    # Otra lógica es que '&&' es un operador por sí solo que convierte 
    # cualquier cosa en una función pura... no sé...

Lo bueno es que desde que aparece una variable, se puede saber si es pura o no, porque los argumentos de funciones solo reciben variables y siempre devuelven variables. Por ejemplo:

    # Aquí no hay problema porque el lenguaje garantiza que v siempre sea una
    # variable común
    push = (arr, v) ->
      arr[arr.length] = v
    # Para recibir una función pura, se necesita explícitamente indicar que
    # eso es lo que se espera. Aquí f es una función pura y se invoca sola
    map = (arr, &f) ->
      narr = {}
      for i,v in arr
        narr[i] = f v
    # En una invocación como esta, el lenguaje se asegura de encajar todo antes
    # de enviarlo como argumento:
    push arr, ()->foo
    # y en una invocación así, da error por tratar de desencajar algo que no es
    # una función:
    map arr, 2
    # pero que esto si funciona, porque desencaja automáticamente
    # (fun es pura y &fun es una caja):
    map arr, &fun
    # Del mismo modo, siempre se devuelven variables puras y hay que 
    # desencajarlas explícitamente
    a, &j = call_fun

Hay un detalle, y es que parece ser que de algún modo, el operador de asignación mágicamente sabe manejar cuando una función es pura o es una caja

    obj.f = (x,y)->nil  # Se guarda una función pura, se invoca sola
    obj.box = &fun      # Se guarda una caja, no se invoca sola

Hay que recordar que el operador de asignación solo es azúcar sintáctico para '_set', que por defecto usa una función core, pero igual es una función. Es por esto que es un problema, porque sea como sea que se pase una función, al otro lado, siempre termina siendo una caja.

Se me ocurrió una solución echándole cabeza en la buseta. El lenguaje, al encajar una función por argumento, crea un objeto, y ese objeto al igual que todos tiene prototipos. Pero no es el mismo prototipo que una función encajada manualmente. Sirven para lo mismo y se comportan exactamente igual, pero es un prototipo diferente, precísamente para permitirle al lenguaje separarlas.
O talves en vez de usar un prototipo diferente,  usar el mismo y uno adicional que no hace nada, o usar un prototipo que tiene de prototipo la caja normal.

## Tipos de acceso

Los objetos se han complicado un poco en mi cabeza, tengo que definir como acceder de diferentes maneras a los campos de un objeto, abajo una lista de los tipos de acceso que se me ocurren:

- Acceso simple: Buscar los campos del objeto y sus prototipos.
- Acceso puro: Buscar solo los campos directamente en el objeto.
- Acceso común: Buscar con acceso simple la función especial _get y ejecutarla. Si no, usar acceso simple, pero en caso de encontrar una función, ejecutarla.

La sintaxis para acceso común es la normal `obj.field`, la de acceso simple puede ser `obj:field` o `obj.&field`, y no tengo para acceso puro, creo que podría ser `get obj, field`, o algo así.
Creo que debería invertirlos, ':' es para puro y no hay para simple.

    Object._pure = (key) ->
      get_field self, key
    Object._simple = (key) ->
      (get_field self, key) or (get_protos_field self, key)
    Object._common = (key, *args) ->
      (self.simpĺe key) *args

## Acceso puro y encajado de funciones

Cómo accedo a las funciones de un objeto?

- `obj.f` Ejecuta la función automáticamente. Si es caja, la devuelve.
- `obj:f` Se trae el objeto directamente. Si es una caja la devuelve, pero si es una función pura? La devuelve pura o la encaja?
- `obj.&f` Qué hace esto?
- `&obj.f` Creo que aquí obj era una función, se encajó y se accedió a un campo de esa caja.
- `obj:&f` Guatafó!
- `&x = f` Si se encaja la parte izquierda qué pasa?
- `&x = &f` Ni idea
- `obj.&f = &g` OH POR DIOS!!
- `&obj:&f = &&g` NOOOOOOOOOO!!!

Tratar de explicar la última:
Según ella, obj es una función, entonces &obj la encaja y se le pueden asignar campos. ':' asigna directamente un campo ignorando _set, pero el campo es &f y guatafó. Según la sintaxis de argumentos, un argumento con el operador aplicado desencaja automáticamente lo que sea que venía allí, es decir, si se asigna una caja, &f toma la función pura dentro de ella. El doble operador indica que si una función es pura, toma la función pura en sí, no su resultado ni una caja, o sea que según esto, 'g' es una función pura. Pero combinado con &f significa que se está desencajando una función pura, que ya viene sin caja. Qué pasa en esta ocasión?

WOW esto es muy confuso y complicado.

El problema es que hay varios tipos de objetos de funciones.

Explicando la última expresión de arriba, se me ocurrió. Para crear una función, no se usa `f = ()->x`, porque el operador automáticamente la encaja, sino hay que hacer `&f = ()->x`, para indicar que se quiere desencajar al asignar. Pero ahora no sé en qué se diferencia `x.&f=()->y` y `x:&f=()->y`
Esto es un pelín inconveniente, ahora hay que escribir cosas como
`carro.&correr = ()->"Corro!"` cuando es más fácil usar
`carro.correr = ()->"Corro!"`.
Pero ahora llego a pensar que la asignación común puede adivinar si una función es pura, y la simple no Pero debería se alrevés porque la asignación simple es parte del lenguaje, y la común es azúcar sintáctico, a menos que los haga a ambos operadores fundamentales... O si mejor sigo con mi esquema antiguo de '.' invocando '_get' y separar las cajas automáticas de las manuales

## Conclusiones por ahora

Siendo x un objeto, f una función pura, y b una caja de función, v cualquiera de las tres

- Como expresiones
  - Uso de variables
    - `x` y `b` toma la variable tal cual
    - `f` Ejecuta la función y toma el resultado
  - Cajas
    - `&x` Toma la variable tal cual
    - `&b` Desencaja la función pura
    - `&f` Encaja la función
  - `x.v` Acceso común. Trata de usar '_get', y si no, usa acceso simple y luego usa el resultado
  - `x:v` Acceso puro, no toca cajas
  - Acceso puro con cajas
    - `x:&x` Acceso puro y toma la variable tal cual
    - `x:&b` Acceso puro y extrae la función
    - `x:&f` Acceso puro y encaja la función
- Como nombres, del lado izquierdo de una asignación
  - `v` Uso de variable, solo asigna la expresión
  - `&v` Extrae y asigna la expresión
  - `x.v` Usa '_set', y si no, asignación pura sin tocar cajas
  - `x:v` Asignación pura, sin tocar cajas
  - `x:&v` Asignación pura, extrayendo
- La forma `x.&v` No es válida de ningun modo
- '&&' es un operador que simula doble caja. Si se usa con una función pura, se obtiene esa misma función pura sin ejecutar. A los objetos y cajas los deja igual.
- El operador '&()' es para currying, no para encajar una expresión. No veo realmente un uso


Array.map = (&f) ->
  narr
  for i, v in self
    narr[i] = f self[i]
  narr

funcs = []
funcs.push = (v) ->
  
Object.get = (key) ->
  v = self:[key]

Object.set = (key, val) ->
  if val.is_a ArgFunction
    self:&[key] = val
  else self:[key] = val

Para simpificar un poco voy a probar otro esquema:
Se tiene el operador '&'. Se puede usar con uso de variables y de campos (no con expresiones arbitrarias). Siempre que se use en lado derecho de la expresión, actúa como caja. Si se usa en el lado izquierdo, funciona como extractor. Este comportamiento se parece al de C++ con el operador de referencia '&', creo, no uso C++.

Igual, el lenguaje sigue encajando automáticamente en los pasos entre funciones

Hay varios tipos de caja diferentes. El primero es BoxedFunction, que es el que tiene una función pura luego de ser encajada manualmente, el segundo es BoxedBox, que es cuando se encaja una caja, el tercero es AutoBox, que es cuando el programa encaja una función pura al pasarla como argumento.


    Array.map = (&f) ->
      narr
      for i, v in self
        narr[i] = f self[i]
      narr

    funcs = []
    funcs.push = (v) ->

    Object._get = (key) ->
      v = self:&[key]
      if not v
        for _,p in self:_protos
          v = self:&[key]
          if v then break
      if v.isa Box and v.type == :AutoBox then


## Flexibilidad de bloques

Con las expresiones 'if', 'for', 'while' y todas esas, quiero que sean muy flexibles. Por eso, propongo esta sintaxis, para que se pueda escribir con la menor cantidad de símbolos y palabras claves posibles.
En definición de gramática, entre dos tokens siempre se asume espacio arbitrario pero no nuevas líneas, 'nospace' indica que no debe haber espacio, y 'anyspace' significa que puede haber cualquier cantidad de espacios y nuevas líneas.
También de algún modo, el analizador léxico puede distinguir mágicamente cuando el analizador sintáctico separa ident de newline

    block := '{' seq '}' | ident seq unident
    seq := { exp (';' | newline) }
    ifstat := 'if' exp ['then'] (block | exp) ['else' (block | exp)]
    exp := access | use | binop
    use := (var | var nospace '.' nospace name) {exp ','}
    binop := exp 'op' [newline] exp


