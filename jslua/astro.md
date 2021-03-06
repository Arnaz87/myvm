# Astro Language

Mi implementación de Lua se estaba separando un poco de Lua real, y me gustaba
hacia donde iba mi variación que si seguía definitivamente no iba a ser Lua,
así que voy a hacer una especificación de este nuevo lenguaje.

El nombre Astro obviamente es un juego de palabras. Lua es Luna en portugues,
quería ponerle Lunar pero se parece mucho, así que le puse Astro porque la luna
es un Astro (dah).

Lo que me encanta de Lua es su simplicidad, pero su sintaxis no es realmente mi
favorita, quiero que se parezca un poco más a la de Coffeescript, que sí me
gusta mucho más. También me gusta un poco el modelo de objetos de Javascript.

Me gusta el modelo de los prototipos, es muy simple. Me gusta que todo sea una
expresión y que cada línea de código tenga un valor. Me gusta la limpieza
sintáctica, como la identación de python, el lambda de Coffeescript, la
obviedad de paréntesis en argumentos de Ruby (más aún la de Haskell)

## Semántica

Existen unos tipos básicos de valores: número, booleano, string, array, objeto,
función y nil. Los strings y los arrays tienen métodos y campos, pero son
limitados, y los números engloban tanto a los enteros como a los flotantes.

Las operaciones hacen coerción. Los aritméticos tratan de convertir a número,
el único no número que puede pasarse a número es el string. Los lógicos tratan
de convertir a booleanos, los números son positivo si son mayores a 0, los
strings son negativos si son vacíos o "false", los objetos y los arrays son
negativos si son vacíos. Los aritméticos enteros y los de bits tratan de
convertir a número y luego redondean a 0 (no al más cercano ni a -infinito).
Los de conjuntos solo funcionan con arrays y strings, y solo con el mismo tipo.
Ninguna de las operaciones modifica los argumentos originales.

## Sintaxis

Los comentarios son con # hasta el final de la línea. Los largos son con ###
hasta le siguiente ###. No hay operador de longitud como en lua, para eso se
usa el método length.

    x=2;y=3
    x,y=2,3
    (x=2) == 2
    x.c == x["c"]
    x.c != x[c]
    x.&c == x.c
    x.f = () -> 3
    x.f == 3
    x.f != () -> 3
    x.&f == () -> 3
    f = (a, b) -> a+b
    f(2,3) == 2+3
    f 2, 3 == f(2,3)
    f 2 3 == f(2(3)) # error, 2 no es función
    f g x == f(g(x)) # esto sí es correcto
    f 2 == f(2)
    f = (a) -> a+1
    (f x = 2) == f(x=2)
    (f;x = 2) == f(); (x=2)
    # (f g x) podría traducir a (f(g))(x), pero haskell y coffeescript traducen a
    # f(g(x)), y como lo usa coffee, lo usaré yo, además fue lo primero que pensé.
    # Smalltalk usa (f(g))(x), smalltalk siempre asocia a la izquierda.

    x.f = &f # válido, asignando el objeto función
    x.f = &f # ya asignado, pero no llama x.f, solo asigna, así que también válido
    x.&f = &f # igual válido

    {a=1,b=2} # Crea un objeto
    {a=1;b=2} # Es un bloque de código
    {a=1} #???
    x = {a=1}       # Parece un objeto...
    if x then {a=1} # Parece un bloque...
    # No sé cómo resolver esto...
    # No quiero mezclar los ":" y "=" en la sintaxis, y hacer que el compilador
    # adivine si espera un bloque o un objeto es mucho trabajo.
    {a=1;b=2} == {a={1;b=2}} # POR DIOS!!
    # la de arriba en realidad no se puede porque un bloque siempre va entre {}
    # pero me asustó...
    # OH!! Ya sé!
    # los bloques de una sola expresión son ilegales...
    # WHOOO qué pinchi genio soy!!
    # le quita libertad a la sintaxis pero funciona. No hacen falta bloques de
    # una sola expresión porque esos se llaman "Expresiones", si es una sola
    # no hace falta encerrarla

    # Otra solución podría ser
    new {a=1} #... nah, está muy feo

    # Otro problema!:
    f(g x, y) # Traduce a uno de:
    f(g(x),y)
    f(g(x,y))
    # Creo que el primero tiene más sentido, pero es dificil para el compilador
    # averiguar que debe usar el primero.
    # Coffee usa el segundo, así que con ese vamos! Haskell también lo usa, 
    # pero... Coffee!

    # La sintaxis para un array es
    [1,2,3]
    # Para acceder a un campo:
    a[1]
    # Pero eso es un acceso a campo, o una función recibiendo un array
    # como argumento?
    # Coffeescript Lo separa con espacios:
    a[1]  # Primer campo de a
    a [1] # Invocar a con un array de un elemento 1 como argumento.

    # Funciones anónimas:
    arr = [1,2,3,4]
    arr.filter (x) -> x>2   # Coffee
    arr.filter \x -> x>2    # Haskell
    arr.filter { |x| x>2 }  # Ruby
    arr.filter fun (x) x>2  # Idea 1 (Original)
    arr.filter ( x -> x>2 ) # Idea 2
    arr.filter { x -> x>2 } # Idea 3 (Variación de 2)
    arr.filter fun x -> x>2 # Idea 4
    # Mas complejo

    # Haskell (Haskell no tiene instrucciones en sequencia)
    arr.each_i (\i, e -> e.something i)

    # Coffee
    arr.each_i (i, e) ->
      e.touch
      e.something i

    # Ruby
    arr.each_i do |i e|
      e.touch
      e.something i
    end

    # Idea 1
    arr.each_i fun (i, e)
      e.touch
      e.something i
    # Con llaves
    arr.each_i fun (i, e) {e.touch; e.something i}

    # Idea 2
    arr.each_i (i, e ->
      e.touch
      e.something i
    ) # Fea porque no se puede usar identacion para agrupar
    # La Idea 3 es igual pero con llaves

    # Idea 4
    arr.each_i fun i, e ->
      e.touch
      e.something 1

    La sintaxis de haskell es genial porque es demasiado compacta y directa, pero no es común, siendo haskell el único lenguaje que conozco con esa sintaxis.
    Existen tres variaciones principales para funciones anónimas.
    La variación "palabra" usa una palabra clave para indicar función, y luego indica los argumentos y el bloque.
    La variación "flecha" escribe los argumentos entre paréntesis, seguidos de una flecha (u otro símbolo) y el bloque.
    La variación "cerrado" encierra los argumentos, o la función entera, con símbolos especiales y luego usa sintaxis especial.
    Palabra es usada por Erlang, Go, Javascript, Lisp, Lua, Perl, PHP, Python
    Flecha es usada por Coffee, Java, D, Dart, Julia, Scala
    Una mezcla de ambas es usada por ML, Haskell, Elm, Groovy (separadas)
    Cerrado es usada por Ruby, Smalltalk, Rust
