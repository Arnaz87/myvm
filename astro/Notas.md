# Notas

Aquí voy guardando todas las notas e ideas a medida que se me vayan ocurriendo, en vez de editar los archivos de texto principales, así puedo tener un registro de cómo evolucionan mis ideas.

Por cierto, recomiendo instalar el plugin de fechas para sulime, es __InsertDate__. Hay que agregar esto en "Preferences->Key Bindings - User":

    { "keys": ["ctrl+f5", "s"],
      "command": "insert_date",
      "args": {"format": "[%Y-%m-%d %H:%M]"}
    }

Y en las preferencias de InsertDate:
`"user_prompt_config": [ { "name": "Stamp", "format": "[%Y-%m-%d %H:%M]" } ]`

Se puede usar en sublime entonces `(ctrl+f5) + s` para crear imprimir la fecha.

# [2016-02-12 23:47] Lo que tenía

No estoy seguro de que quiera escribir todo esto.

# [2016-02-12 23:49] Funciones que no se usan

### Problema

Tengo este problema que me ha estado fastidiando, y es que en Astro ejecuta las variables automáticamente si son funciones: las "usa". Esto es un problema cuando solo quiero pasar funciones por ahí.

    rand = -> random.generate
    x = rand
    x = rand    # x es diferente ahora, perfecto!
    funs = []   # Un array de funciones
    funs.push rand # Ups!
    # funs debería guardar funciones, pero está guardando un número aleatorio

La solución en la que estaba pensando era guardar funciones en caja, de modo que no se ejecuten solas, así se puede hacer `funs.push &rand`, pero el problema es que a veces las variables son parámetros, y no es posible predecir con qué se va a llamar la función. Lo solucionaba con el programa encajando todo lo que se pase como argumento, y separar las funciones con el mismo operador `map = (table, &fun) -> magia_negra!`, pero cada vez se hace más complicado y dificil de resolver, y aún queda los campos de los objetos y todo eso.

### Solución

La nueva solución que tengo, es que las variables que se espera que sean funciones, se indican en el nombre de la variable, y esas son las únicas que se auto-invocan, y con el mismo operador si se usa con una función, no la invoca

    &rand = -> random.generate
    x = rand    # Funciona igual
    funs = []   # Un array de funciones
    funs.push &rand   # Para evitar invocarla
    inc = (x) -> x+1

    y = inc     # 'y' es un objeto función
    y = inc x   # Nope! No deberías hacer esto
    y = inc.call x  # Esto sí funciona!

Del mismo modo, las funciones pueden esperar funciones si quieren, y no volverse locas cuando no quieren funciones pero les dan una

    push = (arr, val) ->
      arr[arr.length] = val  # Si le envían una función no se vuelve loco
    each = (table, &fun) ->
      for v in table
        fun v       # Oh dios qué leendo!

Se parece bastante a la solución de cajas, la diferencia es que esta información ya no está en el valor sino en el nombre, y esto es un precisamente problema, aunque no muy grande, Astro es dinámico, y que haya información de tipo en un nombre hace conflicto con eso, aunque igual planeaba añadir tipos a las variables así que hay que ver como va todo.

Más importante que eso, tengo que resolver cómo funcionará esto con los objetos

# [2016-02-13 01:00] Funciones usables con objetos

Los objetos solo pueden guardar otros objetos. Así, no hay manera de que un campo puro de un objeto sea usable. Ahora, el envío de mensajes si puede usarse para usar campos. Cuando se asigna con operador '.', el método '\_set' decide qué hacer con el objeto. Por defecto solo lo guardará en un campo. Pero si se asigna con '.&', se ejecuta el método '\_setfun', y el objeto sabrá que se trató de asignar una función usable. Luego, al enviar un mensaje, '\_send' hará su magia negra para saber si el campo es usable o no.

El primer problema, cómo hacer que el objeto sepa cuáles campos son usables eficientemente? Lo primero que se me ocurre es un array interno '\_usables' que tiene los nombres de los campos usables. Esto es muy lógico, simple y directo, y como de todos modos '\_send' es un pelo pesado, no importa mucho agregar este pequeño peso extra.

Otro problemita es cuando se crea un objeto literal. Aveces es necesario crear objetos con métodos:

    Duck =
      &speak: -> print "Quack!"
      name: "Donald"
      fun: -> print "High Order!"

La notación de objeto de Coffee asume que se están asignando campos puros, pero los campos puros no pueden ser usables, y esto rompe esa regla. Una solución podría ser asignar el array de usables explícitamente:

    Duck =
      _usables: [:speak]
      speak: -> print "Quack!"
      name: "Donald"
      fun: -> print "High Order!"

No me encanta, se supone que este Array es algo oculto y privado, pero esto es lo más limpio.

Podría dejarse el '&' como azúcar sintáctico únicamente para literales de objetos, como una excepción. Creo que es la mejor opción.

# [2016-02-13 14:55] Nuevo Nombre

El nombre del lenguaje, por ahora, es __Astro__, es un juego de palabras con __Lua__ (Lua -> luna en portugués -> luna es un astro -> Astro!). Se lo puse porque haciendo el parser de Lua, lo estaba cambiando un poquito para hacerlo más fácil, pero cada cambio lo hacía maś diferente de Lua así que creé un lenguaje nuevo.

Pero ahora, el lenguaje no se parece casi nada a Lua, sino a __Coffeescript__, porque la gramática de Coffee siempre me ha gustado, y me estoy basando mucho en ella.

Los nombres que se me ocurren son __Limón__ (Coffee es café-> Café me recuerda a Agua Panela->Agua Panela con Limón-> Limón!) y __Miel__ (El agua panela es como Agua Miel-> Miel!).