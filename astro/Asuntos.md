# Asuntos con Astro...

Vale destacar que con este lenguaje, mis prioridades son: Conceptos simples y Sintaxis intuitiva. Aunque me gusta mucho la sintaxis regular, es más bien un poco secundario aquí.

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

Pendiente...

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

Hay que recordar que el operador de asignación solo es azúcar sintáctico para '_set', pero que por defecto usa una función core, pero una función igual. Es por esto que es un problema, porque sea como sea que se pase una función, al otro lado, siempre termina siendo una caja.
